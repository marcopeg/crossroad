import { runQuery } from '@forrestjs/feature-network'
import { localStorage } from '@forrestjs/feature-storage'
import { setPin } from './journal.reducer'

const fetchQuery = `
    query getJournalEntry (
        $day: YearMonthDay
    ) {
        session {
            auth {
                journalEntry (day: $day) {
                    createdAt
                    updatedAt
                    day
                    content { id text createdAt updatedAt }
                }
            }
        }
    }`

const saveQuery = `
    mutation setJournalEntry (
        $day: YearMonthDay,
        $content: [JournalEntryContentInput]!
    ) {
        session {
            auth {
                journalEntry (
                    day: $day,
                    content: $content
                ) { updatedAt }
            }
        }
    }`

const savePinQuery = `
    mutation setJournalPin(
        $pin: String!
    ) {
        session {
            auth {
                journalSetKey (key: $pin)
            }
        }
    }
`

const formatDate = date => [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, 0),
].join('-')

export const fetchJournal = (receivedDate = new Date()) => async (dispatch) => {
    try {
        const date = typeof receivedDate === 'string' ? new Date(receivedDate) : receivedDate
        const res = await dispatch(runQuery(fetchQuery, { day: formatDate(date) }))
        const entry = res.data.session.auth.journalEntry

        // Inflate dates
        entry.createdAt = new Date(entry.createdAt)
        entry.updatedAt = new Date(entry.updatedAt)
        entry.day = new Date(entry.day)
        entry.content = entry.content ? entry.content.map(part => ({
            ...part,
            createdAt: new Date(part.createdAt),
            updatedAt: new Date(part.updatedAt),
        })) : null

        return entry
    } catch (err) {
        console.warn(`[fetchJournal] ${err.message}`)
        dispatch(setPin(null))
    }
}

export const saveJournal = (day, content) => async (dispatch) => {
    try {
        const res = await dispatch(runQuery(saveQuery, {
            day: formatDate(day),
            content,
        }))
        return res.data.session.auth.journalEntry
    } catch (err) {
        console.warn(`[saveJournal] ${err.message}`)
        dispatch({ type: '@reset' })
    }
}

export const savePin = (pin) => async (dispatch) => {
    await dispatch(runQuery(savePinQuery, { pin }))
    dispatch(localStorage.setItem('journal::pin', true))
    dispatch(setPin(true))
}

export const checkPin = () => (dispatch) => {
    const pin = dispatch(localStorage.getItem('journal::pin'))
    dispatch(setPin(pin ? true : null))
}
