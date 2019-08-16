import { POSTGRES_BEFORE_START } from '@forrestjs/service-postgres/lib/hooks'
import * as hooks from './hooks'
import * as graphqlToken from './graphql-token.lib'
import graphqlTokenMutation from './graphql-token.mutation'

// Sequelize Models
import * as graphqlTokenModel from './graphql-token.model'

// Export APIs
export const validateGraphqlToken = graphqlToken.validate
export const getGraphqlToken = graphqlToken.get

const getToken = req => {
    try {
        return req.headers['authorization'].split('Bearer').pop().trim()
    } catch (err) {
        throw new Error(`Authorization bearer not found!`)
    }
}

export const register = ({ registerHook, registerAction }) => {
    registerHook(hooks)

    // register database models
    registerAction({
        hook: `${POSTGRES_BEFORE_START}/default`,
        name: hooks.FEATURE_NAME,
        handler: ({ registerModel }) =>
            registerModel(graphqlTokenModel),
    })

    // validates a request to upsert an extension using a JWT as
    // provided by:
    // - GraphQL Arg "token"
    // - "Authorization: Bearer xxx" header
    registerAction({
        hook: '$GRAPHQL_EXTENSION_VALIDATE',
        name: hooks.FEATURE_NAME,
        handler: async ({ extension, token, req }) => {
            req.graphqlToken = await graphqlToken.validate({
                token: token || getToken(req),
                extension,
            })
        },
    })

    registerAction({
        hook: '$EXPRESS_GRAPHQL_TEST',
        name: hooks.FEATURE_NAME,
        handler: async ({ registerMutation }) => {
            registerMutation('createExtensionToken', graphqlTokenMutation)
        },
    })
}
