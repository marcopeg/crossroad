import { register } from './extensions-registry'
import * as hooks from './hooks'

export const registerExtensionResolver = async (args, { req, res }) => {
    const { createHook } = req.hooks
    const extension = args.definition.name

    // allows to block a register action based on request informations
    await createHook.serie(hooks.GRAPHQL_EXTENSION_VALIDATE, { ...args, extension, req, res })

    await register(args.definition)

    // allows to persist an extension after it gets registered
    await createHook.serie(hooks.GRAPHQL_EXTENSION_REGISTER, { ...args, extension, req, res })

    return true
}
