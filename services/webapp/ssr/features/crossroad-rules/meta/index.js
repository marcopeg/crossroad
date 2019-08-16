import metaOrigin from './origin'
import metaSignature from './signature'

export default async (meta, graphql) => {
    await metaOrigin(meta, graphql)
    await metaSignature(meta, graphql)
}
