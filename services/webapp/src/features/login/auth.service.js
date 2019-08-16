import { runQuery } from '@forrestjs/feature-network'
import { localStorage } from '@forrestjs/feature-storage'
import { setId } from './auth.reducer'

const loginQuery = `
    mutation (
        $uname:String!
        $passw:String!
    ) {
        login (
        uname: $uname
        passw:$passw
        ) {
            id
        }
    }`

const authQuery = `
    query me {
        session {
            auth {
                id
            }
        }
    }`

export const login = (uname, passw) => async (dispatch) => {
    try {
        const res = await dispatch(runQuery(loginQuery, { uname, passw }))
        dispatch(setId(res.data.login.id))
        dispatch(localStorage.setItem('auth::id', res.data.login.id))
    } catch (err) {
        console.log(err.message)
    }
}

export const checkLogin = () => async (dispatch) => {
    // verify with an API request
    try {
        const res = await dispatch(runQuery(authQuery))
        if (res.data.session.auth) {
            dispatch(setId(res.data.session.auth.id))
            return res.data.session.auth.id
        } else {
            dispatch({ type: '@reset' })
            return null
        }
    } catch (err) {
        console.warn(`[checkLogin] ${err.message}`)
        dispatch({ type: '@reset' })
    }
}

export const start = () => async (dispatch) => {
    // grab from localStorage
    const authId = dispatch(localStorage.getItem('auth::id'))

    // set a first logged in status trusting the localStorage
    if (authId) {
        dispatch(setId(authId))
    }

    // verify with an API request
    return dispatch(checkLogin())
}
