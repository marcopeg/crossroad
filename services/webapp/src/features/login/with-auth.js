import React from 'react'
import { connect } from 'react-redux'

const mapState = ({ auth }) => ({ auth })

const createFallback = fallback => {
    switch (typeof fallback) {
        case 'function':
        case 'object':
            return React.createElement(fallback)
        default:
            return fallback
    }
}

export default ({
    fallback = null,
} = {}) =>
    WrappedComponent =>
        connect(mapState)((props) =>
            props.auth.id
                ? React.createElement(WrappedComponent, props)
                : createFallback(fallback)
        )
