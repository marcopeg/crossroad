/* eslint-disable */

import React from 'react'

const AskPin = ({ onSubmit }) => (
    <form onSubmit={(evt) => {
        evt.preventDefault()
        evt.stopPropagation()
        onSubmit(evt.target[0].value)
    }}>
        <input type="password" name="pin" placeholder="pin" />
        <input type="submit" value="save" />
    </form>
)

export default AskPin
