import { POSTGRES_BEFORE_START } from '@forrestjs/service-postgres/lib/hooks'
import * as hooks from './hooks'
import * as sessionHistoryModel from './session-history.model'
import { addSessionHistory } from './session-history.middleware'

export const register = ({ registerHook, registerAction }) => {
    registerHook(hooks)

    registerAction({
        hook: `${POSTGRES_BEFORE_START}/default`,
        name: hooks.FEATURE_NAME,
        trace: __filename,
        handler: ({ registerModel }) => {
            registerModel(sessionHistoryModel)
        },
    })

    registerAction({
        hook: '$EXPRESS_MIDDLEWARE',
        name: hooks.FEATURE_NAME,
        trace: __filename,
        handler: ({ registerMiddleware }, ctx) => {
            const config = ctx.getConfig('express.session')
            registerMiddleware(addSessionHistory(config, ctx))
        },
    })
}
