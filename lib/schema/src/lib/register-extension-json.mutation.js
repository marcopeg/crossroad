/**
 * Register an extension to the API using a JSON document as definition
 */

import { GraphQLNonNull, GraphQLString } from 'graphql'
import GraphQLJSON from 'graphql-type-json'
import { registerExtensionResolver } from './register-extension.resolver'

export default () => ({
    description: 'Register or updates an GraphQL Extension using a JSON document as definition',
    args: {
        definition: {
            type: new GraphQLNonNull(GraphQLJSON),
        },
        token: {
            type: GraphQLString,
            defaultValue: null,
        },
    },
    type: GraphQLJSON,
    resolve: (_, args, req) => registerExtensionResolver(args, req),
})
