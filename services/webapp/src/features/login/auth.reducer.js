
export const initialState = {
    id: null,
}

/**
 * Actions
 */

export const SET_ID = 'setId@auth'

export const setId = id => ({
    type: SET_ID,
    payload: { id },
})


/**
 * Handlers
 */

export const actionHandlers = {
    '@reset': () => ({ ...initialState }),
    [SET_ID]: (state, { payload }) => ({
        ...state,
        ...payload,
    }),
}

export const reducer = (state = initialState, action) => {
    const handler = actionHandlers[action.type]
    return handler ? handler(state, action) : state
}

export default reducer
