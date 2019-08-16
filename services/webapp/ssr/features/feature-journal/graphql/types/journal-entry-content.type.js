import { GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLString } from 'graphql'
import { GraphQLDate as GraphQLDateTime } from 'graphql-moment'

export const GraphQLJournalEntryContent = new GraphQLObjectType({
    name: 'JournalEntryContent',
    fields: {
        id: {
            type: new GraphQLNonNull(GraphQLID),
        },
        text: {
            type: new GraphQLNonNull(GraphQLString),
        },
        createdAt: {
            type: new GraphQLNonNull(GraphQLDateTime),
            resolve: $ => new Date($.createdAt),
        },
        updatedAt: {
            type: new GraphQLNonNull(GraphQLDateTime),
            resolve: $ => new Date($.updatedAt),
        },
    },
})
