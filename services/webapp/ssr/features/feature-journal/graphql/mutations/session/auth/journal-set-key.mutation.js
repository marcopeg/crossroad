import { GraphQLNonNull, GraphQLString } from 'graphql'
import { encryptKey } from '../../../../journal-utils'

export const journalSetKeyMutation = async () => ({
    description: 'Hashes the user encryption PIN',
    args: {
        key: {
            type: new GraphQLNonNull(GraphQLString),
        },
    },
    type: GraphQLString,
    resolve: async (auth, args, { req }) => encryptKey(req, args.key),
})
