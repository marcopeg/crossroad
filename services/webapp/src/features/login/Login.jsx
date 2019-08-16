import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { login } from './auth.service'

const styles = {
    wrapper: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(255, 255, 255, 0.6)',
    },
    inner: {
        margin: '10vh auto',
        maxWidth: '600px',
    },
}

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
        <div style={styles.wrapper}>
            <div style={styles.inner}>
                <h2>Login</h2>
                <hr />
                <a href="/auth/facebook">Login with Facebook</a><br />
                <a href="/auth/google">Login with Google</a><br />
                <a href="/auth/github">Login with GitHub</a><br />
                <a href="/auth/instagram">Login with Instagram</a><br />
                <hr />
                <form type="POST" onSubmit={onSubmit}>
                    <input type="text" name="uname" placeholder="username" />
                    <input type="password" name="passw" placeholder="password" />
                    <button>Login</button>
                </form>
            </div>
        </div>
    )

Login.propTypes = {
    hasLogin: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired,
}

export default connect(mapState, mapDispatch)(Login)
