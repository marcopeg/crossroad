import jwt from 'jsonwebtoken'
import clone from 'clone-deep'

const query = `
    mutation reg (
        $token: String
        $definition: GraphQLExtension!
    ) {
        registerExtension (
            token: $token
            definition: $definition
        ) 
    }`

const generateSecret = (secret, prefix = 'x') => secret
    ? secret
    : `${prefix}-${Date.now()}`

const validateToken = (secret, token) =>
    new Promise((resolve, reject) =>
        jwt.verify(token, secret, err => err ? reject() : resolve())
    )

export const createExtension = ({
    name,
    endpoint,
    token,
    variables,
    headers = [],
    secret: originalSecret,
    definition: originalDefinition,
}) => {
    // Make sure the original definition is left untouched
    // and fill in dynamically defined variables
    // (handles both dictionary or list format)
    const definition = clone(originalDefinition)
    definition.name = name
    definition.variables = Array.isArray(variables)
        ? variables
        : Object.keys(variables).reduce((acc, curr) => ([
            ...acc,
            { name: curr, value: variables[curr] },
        ]), [])

    // Inject shared headers
    // (handles both dictionary or list format)
    const injectHeaders = item => {
        !item.resolve.headers && (item.resolve.headers = [])
        if (Array.isArray(headers)) {
            headers.forEach(header => item.resolve.headers.unshift(header))
        } else {
            Object.keys(headers).forEach(name => {
                item.resolve.headers.unshift({ name, value: headers[name] })
            })
        }
    }
    definition.queries && definition.queries.forEach(injectHeaders)
    definition.mutations && definition.mutations.forEach(injectHeaders)

    // Set the initial secret for the extension
    // (new secrets are prepended (unshift), old secrets are popped)
    const secrets = [generateSecret(originalSecret, name)]
    definition.secret = secrets[0]

    // Run the GraphQL Request
    const register = async () => {
        let res = null
        let doc = null
        try {
            res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query,
                    variables: { token, definition },
                }),
            })
        } catch (err) {
            throw new Error(`fetch failed - ${err.message}`)
        }

        // Handle any error statusCodes with the intention of forwarding the
        // GraphQL error messages that may be contained
        if (res.status !== 200) {
            let message = null
            try {
                const data = await res.json()
                data.errors && (message = data.errors.map(err => err.message).join(' -- '))
            } catch (err) {
                message = `${res.status} ${res.statusText}`
            }

            throw new Error(`request failed - ${message}`)
        }

        try {
            doc = await res.json()
        } catch (err) {
            throw new Error(`unexpected response format - ${err.message}`)
        }

        if (doc.errors) {
            throw new Error(doc.errors.shift().message)
        }

        if (!doc.data.registerExtension) {
            throw new Error('Oooops, something weird happened :-|')
        }
    }

    // attempts to validate the token agains all the stored secrets
    // so to handle validation during a secret rotation action
    const validateSecret = async (token) => {
        for (const secret of secrets) {
            try {
                await validateToken(secret, token)
                return true
            } catch (err) {} // eslint-disable-line
        }
        return false
    }

    const validateRequest = async (req, {
        header = 'x-crossroad-signature',
        message = 'Invalid GRAPI Signature',
    } = {}) => {
        if (!await validateSecret(req.headers[header])) {
            throw new Error(message)
        }
    }

    const createMiddleware = ({
        header = 'x-crossroad-signature',
        statusCode = 400,
        statusMessage = 'Invalid GRAPI Signature',
    } = {}) =>
        (req, res, next) =>
            validateRequest(req, { header })
                .then(() => next())
                .catch(() => {
                    res.statusMessage = statusMessage
                    res.status(statusCode).end()
                })

    // re-register the extension with a new secret
    // rolls back the secret in case of errors
    const rotateSecret = async () => {
        definition.secret = generateSecret(originalSecret, name)

        try {
            await register()
            secrets.unshift(definition.secret)
            setTimeout(() => secrets.pop(), 1000)
        } catch (err) {
            definition.secret = secrets[0]
            throw err
        }
    }

    return { register, validateRequest, createMiddleware, rotateSecret }
}
