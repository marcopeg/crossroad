
const cache = {
    endpoint: null,
    headers: {},
    errorMessage: 'Ooooops!',
}

export const setEndpoint = endpoint => {
    cache.endpoint = endpoint
}

export const setHeader = (name, value) => {
    cache.headers[name] = value
}

export const setErrorMessage = errorMessage => {
    cache.errorMessage = errorMessage
}

export const runQuery = async (...args) => {

    if (typeof args[0] === 'string') {
        return runQuery({
            query: args[0],
            variables: args[1],
        })
    }
    
    const {
        query,
        variables,
        headers = cache.headers,
        endpoint = cache.endpoint,
    } = args[0]

    if (!endpoint) {
        throw new Error('A @crossroad server endpoint (url) must be specified')
    }

    let res = null
    try {
        res = await fetch(endpoint, {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                ...(headers ? { ...headers } : {}),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query, variables }),
        })
    } catch (err) {
        throw new Error(`fetch failed - ${err.message}`)
    }

    // Handle JSON errors
    try {
        const query = await res.json()

        return {
            ...query,
            throwHtmlError: (message) => {
                if (query.errors) {
                    throw new Error(errors2html(query.errors, message))
                }
            },
        }
    } catch (_) {
        const err = new Error(_.message)
        err.res = res
        throw err
    }
}

export const errors2html = (errors, message = cache.errorMessage) => {
    const html = errors.map(err => `<li>${err.path.join('/')} - ${err.message}</li>`).join('')
    return `<h2>${message}</h2>${html}`
}

