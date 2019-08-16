import * as hooks from './hooks'
import { getExtension } from '../../services/crossroad-schema'

import decorateMeta from './meta'
import applyRules from './rules'

export const register = ({ registerHook, registerAction }) => {
    registerHook(hooks)

    // this is supposed to regulate access to a single extension's method request by request
    registerAction({
        hook: 'GRAPHQL_EXTENSION_RESOLVE',
        handler: async ({ extension, method, type, source, graphql, variables }) => {
            // Decorate the resolver variables with meta informations regarding the current request
            const meta = {
                extension,
                method,
                type,
            }

            // Collect meta informations and apply the validation rules
            await decorateMeta(meta, graphql)
            await applyRules(getExtension(extension).rules, meta, graphql)

            // Decorate the resolver's arguments so that those info can be used by the extension's definition
            variables.meta = meta
        },
    })
}
