/**
 * Generates a valid signature for the target Extension based on her secret
 */

import { sign } from '@forrestjs/service-jwt'
import { getExtension } from '../../../services/crossroad-schema'

export default async (meta, graphql) => {
    try {
        const { extension } = meta
        meta.signature = await sign({ extension }, {}, getExtension(extension).secret)
    } catch (err) {
        meta.signature = false
    }
}
