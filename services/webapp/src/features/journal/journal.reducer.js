
export const initialState = {
    pin: null,
}

/**
 * Actions
 */

export const SET_PIN = 'setPin@journal'

export const setPin = pin => ({
    type: SET_PIN,
    payload: { pin },
})


/**
 * Handlers
 */

export const actionHandlers = {
    '@reset': () => ({ ...initialState }),
    [SET_PIN]: (state, { payload }) => ({
        ...state,
        ...payload,
    }),
}

export const reducer = (state = initialState, action) => {
    const handler = actionHandlers[action.type]
    return handler ? handler(state, action) : state
}

export default reducer
