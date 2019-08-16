/* eslint-disable */

import React from 'react'
import { connect } from 'react-redux'
import { Redirect, Route } from 'react-router-dom'
import { checkLogin } from './auth.service'

const mapState = () => ({})

const mapDispatch = { checkLogin }

const VerifyLogin = connect(mapState, mapDispatch)(class extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            redirect: null,
        }
    }

    componentDidMount () {
        this.props.match && this.checkLogin()
    }

    checkLogin = async () => {
        this.setState({ redirect: null })
        const authId = await this.props.checkLogin()
        authId && this.setState({ redirect: '/' })
    }

    render () {
        if (this.props.match && this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }

        return 'VERFY'
    }
})

export default () => (
    <Route
        exact
        path="/login/verify"
        component={VerifyLogin}
    />
)

