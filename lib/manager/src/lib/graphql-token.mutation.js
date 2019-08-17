import {
    GraphQLNonNull,
    GraphQLString,
} from 'graphql'

import { issue } from './graphql-token.lib'

export default {
    description: 'Generates a new extension token valid for one extension',
    args: {
        extension: {
            type: new GraphQLNonNull(GraphQLString),
        },
        duration: {
            type: GraphQLString,
            defaultValue: '1y',
        },
    },
    type: new GraphQLNonNull(GraphQLString),
    resolve: (_, args, ctx) => issue(args, ctx),
}
