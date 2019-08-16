import { GraphQLInputObjectType, GraphQLNonNull, GraphQLID, GraphQLString } from 'graphql'
import { GraphQLDate as GraphQLDateTime } from 'graphql-moment'

export const GraphQLJournalEntryContentInput = new GraphQLInputObjectType({
    name: 'JournalEntryContentInput',
    fields: {
        id: {
            type: new GraphQLNonNull(GraphQLID),
        },
        text: {
            type: new GraphQLNonNull(GraphQLString),
        },
        createdAt: {
            type: GraphQLDateTime,
            defaultValue: new Date(),
        },
        updatedAt: {
            type: GraphQLDateTime,
            defaultValue: new Date(),
        },
    },
})
