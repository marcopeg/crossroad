import { GraphQLString } from 'graphql'
import { version } from '../../package.json'

export const register = ({ registerAction }) =>
    registerAction({
        hook: '$EXPRESS_GRAPHQL',
        optional: true,
        handler: ({ registerQuery }) => registerQuery('version', {
            type: GraphQLString,
            resolve: () => version,
        }),
    })
