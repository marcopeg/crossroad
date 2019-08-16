import { GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql'
import { GraphQLYYYYMMDD as GraphQLDate } from 'graphql-moment'
import { getModel } from '@forrestjs/service-postgres'
import { GraphQLJournalEntryContentInput } from '../../../types/journal-entry-content.input'
import { GraphQLJournalEntry } from '../../../types/journal-entry.type'
import { decryptKey } from '../../../../journal-utils'

export const journalEntryMutation = async () => ({
    description: 'Writes a journal entry related to the identity',
    args: {
        day: {
            type: GraphQLDate,
            defaultValue: new Date(),
        },
        key: {
            type: GraphQLString,
        },
        content: {
            type: new GraphQLNonNull(new GraphQLList(GraphQLJournalEntryContentInput)),
        },
    },
    type: GraphQLJournalEntry,
    resolve: async (auth, args, { req }) => {
        const [model] = await getModel('JournalEntry').upsertEncrypted({
            accountId: auth.id,
            day: args.day,
            content: args.content,
        }, args.key || await decryptKey(req))

        return model
    },
})
