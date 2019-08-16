import {
    GraphQLNonNull,
    GraphQLInputObjectType,
    GraphQLEnumType,
    GraphQLList,
    GraphQLString,
    GraphQLBoolean,
} from 'graphql'
import GraphQLJSON from 'graphql-type-json'
import { registerExtensionResolver } from './register-extension.resolver'

const GraphQLExtensionRestMethods = new GraphQLEnumType({
    name: 'GraphQLExtensionRestMethods',
    values: {
        GET: { value: 'GET' },
        PUT: { value: 'PUT' },
        POST: { value: 'POST' },
    },
})

const GraphQLExtensionResolveTypes = new GraphQLEnumType({
    name: 'GraphQLExtensionResolveTypes',
    values: {
        rest: { value: 'rest' },
        graphql: { value: 'graphql' },
    },
})

const GraphQLExtensionField = new GraphQLInputObjectType({
    name: 'GraphQLExtensionField',
    description: 'GraphQL Extension Field definition',
    fields: {
        name: {
            type: new GraphQLNonNull(GraphQLString),
        },
        type: {
            type: new GraphQLNonNull(GraphQLString),
        },
    },
})

const GraphQLExtensionHeader = new GraphQLInputObjectType({
    name: 'GraphQLExtensionHeader',
    description: 'GraphQL Extension Header field definition',
    fields: {
        name: {
            type: new GraphQLNonNull(GraphQLString),
        },
        value: {
            type: new GraphQLNonNull(GraphQLString),
        },
    },
})

const GraphQLExtensionBody = new GraphQLInputObjectType({
    name: 'GraphQLExtensionBody',
    description: 'GraphQL Extension Body field definition',
    fields: {
        name: {
            type: new GraphQLNonNull(GraphQLString),
        },
        value: {
            type: new GraphQLNonNull(GraphQLString),
        },
    },
})

const GraphQLExtensionFetchRule = new GraphQLInputObjectType({
    name: 'GraphQLExtensionFetchRule',
    description: 'GraphQL Extension REST rule field definition',
    fields: {
        match: {
            type: new GraphQLNonNull(GraphQLJSON),
        },
        apply: {
            type: new GraphQLNonNull(GraphQLJSON),
        },
    },
})

const GraphQLExtensionType = new GraphQLInputObjectType({
    name: 'GraphQLExtensionType',
    description: 'GraphQL Extension Type definition',
    fields: {
        name: {
            type: new GraphQLNonNull(GraphQLString),
        },
        fields: {
            type: new GraphQLList(GraphQLExtensionField),
        },
    },
})

const GraphQLExtensionRule = new GraphQLInputObjectType({
    name: 'GraphQLExtensionRule',
    description: 'GraphQL Extension Rule definition',
    fields: {
        name: {
            type: new GraphQLNonNull(GraphQLString),
        },
        options: {
            type: GraphQLJSON,
            defaultValue: {},
        },
    },
})

const GraphQLExtensionVariable = new GraphQLInputObjectType({
    name: 'GraphQLExtensionVariable',
    description: 'GraphQL Extension Variable definition',
    fields: {
        name: {
            type: new GraphQLNonNull(GraphQLString),
        },
        value: {
            type: new GraphQLNonNull(GraphQLJSON),
        },
    },
})

const GraphQLExtensionResolver = new GraphQLInputObjectType({
    name: 'GraphQLExtensionResolver',
    description: 'GraphQL Extension Resolver definition',
    fields: {
        type: {
            type: new GraphQLNonNull(GraphQLExtensionResolveTypes),
        },
        url: {
            type: new GraphQLNonNull(GraphQLString),
        },
        method: {
            type: GraphQLExtensionRestMethods,
        },
        query: {
            type: GraphQLString,
        },
        variables: {
            type: new GraphQLList(GraphQLExtensionVariable),
        },
        headers: {
            type: new GraphQLList(GraphQLExtensionHeader),
        },
        body: {
            type: new GraphQLList(GraphQLExtensionBody),
        },
        rules: {
            type: new GraphQLList(GraphQLExtensionFetchRule),
        },
        grab: {
            type: GraphQLString,
        },
    },
})

const GraphQLExtensionQuery = new GraphQLInputObjectType({
    name: 'GraphQLExtensionQuery',
    description: 'GraphQL Extension Query definition',
    fields: {
        name: {
            type: new GraphQLNonNull(GraphQLString),
        },
        args: {
            type: new GraphQLList(GraphQLExtensionField),
        },
        type: {
            type: new GraphQLNonNull(GraphQLString),
        },
        resolve: {
            type: new GraphQLNonNull(GraphQLExtensionResolver),
        },
    },
})

const GraphQLExtensionQueryWrapper = new GraphQLInputObjectType({
    name: 'GraphQLExtensionQueryWrapper',
    description: 'GraphQL Extension Query Wrapper definition',
    fields: {
        args: {
            type: new GraphQLList(GraphQLExtensionField),
        },
    },
})

const GraphQLExtensionMutation = new GraphQLInputObjectType({
    name: 'GraphQLExtensionMutation',
    description: 'GraphQL Extension Mutation definition',
    fields: {
        name: {
            type: new GraphQLNonNull(GraphQLString),
        },
        args: {
            type: new GraphQLList(GraphQLExtensionField),
        },
        type: {
            type: new GraphQLNonNull(GraphQLString),
        },
        resolve: {
            type: new GraphQLNonNull(GraphQLExtensionResolver),
        },
    },
})

const GraphQLExtension = new GraphQLInputObjectType({
    name: 'GraphQLExtension',
    description: 'GraphQL Extension definition',
    fields: {
        name: {
            type: new GraphQLNonNull(GraphQLString),
        },
        variables: {
            type: new GraphQLList(GraphQLExtensionVariable),
        },
        types: {
            type: new GraphQLList(GraphQLExtensionType),
        },
        inputTypes: {
            type: new GraphQLList(GraphQLExtensionType),
        },
        queries: {
            type: new GraphQLList(GraphQLExtensionQuery),
        },
        mutations: {
            type: new GraphQLList(GraphQLExtensionMutation),
        },
        queryWrapper: {
            type: GraphQLExtensionQueryWrapper,
        },
        mutationWrapper: {
            type: GraphQLExtensionQueryWrapper,
        },
        rules: {
            type: new GraphQLList(GraphQLExtensionRule),
        },
        secret: {
            type: GraphQLString,
            defaultValue: null,
        },
        shouldRunQueries: {
            type: new GraphQLNonNull(GraphQLBoolean),
            defaultValue: true,
        },
        shouldRunMutations: {
            type: new GraphQLNonNull(GraphQLBoolean),
            defaultValue: true,
        },
    },
})

export default () => ({
    description: 'Register or updates an GraphQL Extension using a typed validated definition',
    args: {
        token: {
            type: GraphQLString,
            defaultValue: null,
        },
        definition: {
            type: new GraphQLNonNull(GraphQLExtension),
        },
    },
    type: GraphQLJSON,
    resolve: (_, args, ctx) =>
        registerExtensionResolver({
            ...args,
            definition: {
                ...args.definition,
                __type: 'gql',
            },
        }, ctx),
})
