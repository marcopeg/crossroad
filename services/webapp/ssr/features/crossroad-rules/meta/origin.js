/**
 * Tries to validate an API token against the database.
 *
 * - graphql.args  "xCrossroadOrigin"
 * - req.header    "x-xCrossroadOrigin-origin"
 */

import { decode } from '@forrestjs/service-jwt'
import { validateGraphqlToken } from '../../crossroad-manager'

export default async (meta, graphql) => {
    const { root, args, context } = graphql
    try {
        const token = root.xCrossroadOrigin || args.xCrossroadOrigin || context.req.headers['x-crossroad-origin']
        const data = decode(token)
        await validateGraphqlToken({ token, extension: data.payload.extension })
        meta.origin = data.payload.extension
    } catch (err) {
        meta.origin = false
    }
}
