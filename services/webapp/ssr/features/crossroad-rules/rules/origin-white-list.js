/**
 * White lists origins in order to accept a request
 *
 * {
 *   "name": "originWhiteList",
 *   "options": { "accept": [ "value", "value", ... ] }
 * }
 */

export default (rule, meta, graphql) => {
    if (!rule.options.accept.includes(meta.origin)) {
        throw new Error(`Origin "${meta.origin}" not allowed`)
    }
}
