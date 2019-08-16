/**
 * It converts from a GraphQL compatible defintion to an object based
 * definition that is used by "graphql-extension".
 */

import { parseExtension as buildExtensionSchema } from 'graphql-extension'

// In case a resolver doesn't offer a specific set of rules,
// the "statusError" rule is being applied so to correctly propagate
// any HTTP error that might be found
const defaultRules = [
    {
        match: ['statusError'],
        apply: ['statusError'],
    },
]

const reduceFields = fields =>
    fields.reduce(
        (acc, curr) => ({
            ...acc,
            [curr.name]: curr.type,
        }),
        {}
    )

const reduceTypes = types =>
    types.reduce(
        (acc, curr) => ({
            ...acc,
            [curr.name]: reduceFields(curr.fields),
        }),
        {}
    )

const reduceHeaders = fields =>
    fields.reduce(
        (acc, curr) => ({
            ...acc,
            [curr.name]: curr.value,
        }),
        {}
    )

const reduceVariables = fields =>
    fields.reduce(
        (acc, curr) => ({
            ...acc,
            [curr.name]: curr.value,
        }),
        {}
    )

const reduceResolver = resolver => ({
    type: resolver.type,
    url: resolver.url,
    ...(resolver.method ? { method: resolver.method } : {}),
    ...(resolver.query ? { query: resolver.query } : {}),
    ...(resolver.variables ? { variables: reduceVariables(resolver.variables) } : {}),
    ...(resolver.grab ? { grab: resolver.grab } : {}),
    ...(resolver.headers ? { headers: reduceHeaders(resolver.headers) } : {}),
    ...(resolver.body ? { body: reduceHeaders(resolver.body) } : {}),
    ...(resolver.rules ? { rules: resolver.rules } : { rules: defaultRules }),
})

const reduceQueries = queries =>
    queries.reduce(
        (acc, curr) => ({
            ...acc,
            [curr.name]: {
                type: curr.type,
                ...(curr.args ? { args: reduceFields(curr.args) } : {}),
                resolve: reduceResolver(curr.resolve),
            },
        }),
        {}
    )

// Transform a GraphQL compatible definition into a JSON document as used
// in the `buildExtensionSchema()` API
export const toJSON = definition => {
    const doc = {
        name: definition.name,
        secret: definition.secret,
        shouldRunQueries: definition.shouldRunQueries,
        shouldRunMutations: definition.shouldRunMutations,
        ...(definition.variables ? { variables: reduceVariables(definition.variables) } : {}),
        ...(definition.types ? { types: reduceTypes(definition.types) } : {}),
        ...(definition.inputTypes ? { inputTypes: reduceTypes(definition.inputTypes) } : {}),
        ...(definition.queries ? { queries: reduceQueries(definition.queries) } : {}),
        ...(definition.mutations ? { mutations: reduceQueries(definition.mutations) } : {}),
        rules: definition.rules,
    }

    if (definition.queryWrapper) {
        const { args } = definition.queryWrapper
        doc.queries['__wrapper__'] = {
            ...(args ? { args: reduceFields(args) } : {}),
        }
    }

    if (definition.mutationWrapper) {
        const { args } = definition.mutationWrapper
        doc.queries['__wrapper__'] = {
            ...(args ? { args: reduceFields(args) } : {}),
        }
    }

    return doc
}

/**
 * definition.__type === 'gql'
 * means that the file format uses the long array list, the structure
 * that can be validated via GraphQL
 *
 * In that case there is the need to translate that format into the
 * normal JSON object based that is used by `graphql-extension`.
 */
export const parseExtension = (definition, options) =>
    definition.__type === 'gql'
        ? buildExtensionSchema(toJSON(definition), options)
        : buildExtensionSchema(definition, options)
