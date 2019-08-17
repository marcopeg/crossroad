import { parseExtension } from './extension-parser'

import * as hooks from './hooks'
import registerExtensionMutation from './register-extension.mutation'
import registerExtensionJSONMutation from './register-extension-json.mutation'
import * as extensionsRegistry from './extensions-registry'

// allows to directly register features in the in-memory registry
// eg. this is used to sync different servers via pub/sub
export const registerExtension = extensionsRegistry.register
export const reflowExtensions = extensionsRegistry.reflow
export const getExtension = extensionsRegistry.getExtension

export const register = ({ registerHook, registerAction, createHook }) => {
    registerHook(hooks)

    // Preload cached extensions
    registerAction({
        hook: '$START_SERVICE',
        name: hooks.SERVICE_NAME,
        trace: __filename,
        handler: async ({ getConfig }) => {
            const settings = getConfig('graphqlExtension', {})
            await extensionsRegistry.init(settings)

            // boot time extension, allow to source more extensions at boot time
            await createHook.parallel(hooks.GRAPHQL_EXTENSION_START, {
                loadFromDisk: extensionsRegistry.loadFromDisk,
                register: extensionsRegistry.register,
                settings,
            })
        },
    })

    // Invalidates GraphQL's middleware cache when the extensions change
    registerAction({
        hook: '$EXPRESS_GRAPHQL_MIDDLEWARE',
        name: hooks.SERVICE_NAME,
        trace: __filename,
        handler: ({ registerMiddleware }) =>
            registerMiddleware((req, res, next) => {
                req.bumpGraphqlETAG(extensionsRegistry.getEtag())
                next()
            }),
    })

    // Extend GraphQL Schema
    registerAction({
        hook: '$EXPRESS_GRAPHQL',
        name: hooks.SERVICE_NAME,
        trace: __filename,
        handler: async ({ registerQuery, registerMutation }, ctx) => {
            // Add Grapi API
            registerMutation('registerExtension', await registerExtensionMutation())

            // Add Extensions From the Registry
            extensionsRegistry.getList().forEach((definition) => {
                const extension = parseExtension(definition, { hooks: ctx })
                Object.keys(extension.queries).forEach(key => registerQuery(key, extension.queries[key]))
                Object.keys(extension.mutations).forEach(key => registerMutation(key, extension.mutations[key]))
            })
        },
    })

    // Extend GraphQL Test Schema
    registerAction({
        hook: '$EXPRESS_GRAPHQL_TEST',
        name: hooks.SERVICE_NAME,
        trace: __filename,
        handler: async ({ registerMutation }) => {
            registerMutation('registerExtension', await registerExtensionJSONMutation())
        },
    })
}
