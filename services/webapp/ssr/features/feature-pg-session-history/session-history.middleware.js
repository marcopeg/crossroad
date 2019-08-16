import { getModel } from '@forrestjs/service-postgres'
import * as hooks from './hooks'

export const addSessionHistory = (config, ctx) => (req, res, next) => {
    const SessionHistory = getModel('SessionHistory')
    const { attributeName } = config

    res.on('finish', async () => {
        const fields = {
            url: req.url,
            requestId: req.id,
            deviceId: req.deviceId,
            data: req[attributeName].data,
            graphql: req.body && req.body.query ? req.body : null,
        }

        // Make an extensible definition of the session history record
        const registerField = (key, val) => (fields[key] = val)
        await ctx.createHook.serie(hooks.PG_SESSION_HISTORY_DECORATE_RECORD, { registerField, req, res })

        // Write to the db without blocking the remaining development of the request
        await SessionHistory.create({
            ...fields,
            createdAt: new Date(),
            sessionId: req[attributeName].id,
        })
    })

    next()
}
