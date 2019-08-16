import { GraphQLString } from 'graphql'
import { GraphQLYYYYMMDD as GraphQLDate } from 'graphql-moment'
import { getModel } from '@forrestjs/service-postgres'
import { GraphQLJournalEntry } from '../../../types/journal-entry.type'
import { decryptKey } from '../../../../journal-utils'

export const journalEntryQuery = async () => ({
    description: 'Reads a journal entry related to the identity',
    args: {
        day: {
            type: GraphQLDate,
            defaultValue: new Date(),
        },
        key: {
            type: GraphQLString,
        },
    },
    type: GraphQLJournalEntry,
    resolve: async (auth, args, { req }) => {
        const entry = await getModel('JournalEntry').findOneEncrypted({
            accountId: auth.id,
            ...args,
        }, args.key || await decryptKey(req))

        // default into a new document for the day
        return entry || {
            accountId: auth.id,
            day: args.day,
            content: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    },
})
