import { GraphQLObjectType, GraphQLNonNull, GraphQLList } from 'graphql'
import { GraphQLYYYYMMDD as GraphQLDate, GraphQLDate as GraphQLDateTime } from 'graphql-moment'
import { GraphQLJournalEntryContent } from './journal-entry-content.type'

export const GraphQLJournalEntry = new GraphQLObjectType({
    name: 'JournalEntry',
    fields: {
        day: {
            type: new GraphQLNonNull(GraphQLDate),
            resolve: $ => new Date($.day),
        },
        content: {
            type: new GraphQLList(GraphQLJournalEntryContent),
        },
        createdAt: {
            type: new GraphQLNonNull(GraphQLDateTime),
        },
        updatedAt: {
            type: new GraphQLNonNull(GraphQLDateTime),
        },
    },
})
