import { registerExtension, reflowExtensions } from '../../services/crossroad-schema'
import { getModel } from '@forrestjs/service-postgres'

export const register = async () => {
    await reflowExtensions()
    const extensions = await getModel('CrossroadRegistry').findAll({ raw: true })
    extensions.forEach(extension => registerExtension(extension.definition))
}

export const upsert = (extension, definition) =>
    getModel('CrossroadRegistry').upsert({
        extension,
        definition,
    })
