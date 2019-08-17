/**
 * The request must come with a valid origin token
 *
 * {
 *   "rule": "originNotNull",
 * }
 */
export default (rule, meta, graphql) => {
    if (!meta.origin) {
        throw new Error(`Unknown request origin`)
    }
}
