import { POSTGRES_BEFORE_START } from '@forrestjs/service-postgres/lib/hooks'
import { getModel } from '@forrestjs/service-postgres'
import * as hooks from './hooks'
import * as journalEntryModel from './journal-entry.safe.model'
import { journalEntryQuery } from './graphql/queries/session/auth/journal-entry.query'
import { journalEntryMutation } from './graphql/mutations/session/auth/journal-entry.mutation'
import { journalUpdateKeyMutation } from './graphql/mutations/session/auth/journal-update-key.mutation'
import { journalSetKeyMutation } from './graphql/mutations/session/auth/journal-set-key.mutation'
import { cleanSession } from './journal-utils'

export default ({ registerHook, registerAction }) => {
    registerHook(hooks)

    // Add Auth Data Model
    registerAction({
        hook: `${POSTGRES_BEFORE_START}/default`,
        name: hooks.FEATURE_NAME,
        handler: ({ registerModel }) => {
            registerModel(journalEntryModel)
        },
    })

    // Inject the GraphQL APIs
    registerAction({
        hook: '$PG_AUTH_GRAPHQL',
        name: hooks.FEATURE_NAME,
        handler: async ({ registerQuery, registerMutation }) => {
            registerQuery('journalEntry', await journalEntryQuery())
            registerMutation('journalEntry', await journalEntryMutation())
            registerMutation('journalSetKey', await journalSetKeyMutation())
            registerMutation('journalUpdateKey', await journalUpdateKeyMutation())
        },
    })

    // Cleanup session on logout
    registerAction({
        hook: '$PG_AUTH_LOGOUT',
        name: hooks.FEATURE_NAME,
        handler: ({ req }) => cleanSession(req),
    })

    // Cleanup session on session end detection
    registerAction({
        hook: '$PG_SESSION_CLEANUP',
        name: hooks.FEATURE_NAME,
        handler: (args, { logError, logVerbose }) => {
            const promises = args.records
                .filter(data => data.payload.journal_key)
                .map(data => getModel('SessionRecord').unsetValue(data.id, 'journal_key'))

            Promise.all(promises)
                .then(() => logVerbose(`[feature-journal] cleared ${promises.length} session from the "journal_key"`))
                .catch(err => logError(`[feature-journal] ${err.message}`))
        },
    })
}
