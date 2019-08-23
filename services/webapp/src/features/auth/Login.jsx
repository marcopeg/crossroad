import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { login } from './auth.service'
import * as styles from './Login.module.css'

const mapState = ({ auth }) => ({
    hasLogin: auth.id !== null,
})

const mapDispatch = (dispatch) => ({
    onSubmit: (evt) => {
        evt.preventDefault()
        evt.stopPropagation()
        dispatch(login(evt.target[0].value, evt.target[1].value))
    },
})

const Login = ({ hasLogin, onSubmit }) =>
    hasLogin ? null : (
        <div className={styles.wrapper}>
            <h2>Login</h2>
            <form type="POST" onSubmit={onSubmit}>
                <input type="text" name="uname" placeholder="username" />
                <input type="password" name="passw" placeholder="password" />
                <button>Login</button>
            </form>
        </div>
    )

Login.propTypes = {
    hasLogin: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired,
}

export default connect(mapState, mapDispatch)(Login)
