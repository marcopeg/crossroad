import { GraphQLNonNull, GraphQLString } from 'graphql'
import { getModel } from '@forrestjs/service-postgres'
import { decryptKey, encryptKey } from '../../../../journal-utils'

export const journalUpdateKeyMutation = async () => ({
    description: 'Updates the encrypted data with a new key ',
    args: {
        key: {
            type: GraphQLString,
        },
        newKey: {
            type: new GraphQLNonNull(GraphQLString),
        },
    },
    type: GraphQLString,
    resolve: async (auth, args, { req }) => {
        const key = args.key || await decryptKey(req)

        await getModel('JournalEntry').updateUserEncryptionKey({
            ...args,
            key,
            accountId: auth.id,
        })

        return encryptKey(req, args.newKey)
    },
})
