import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Verify from './Verify'
import Login from './Login'

const LoginAPP = () => (
    <Switch>
        <Route path="/login/" exact component={Login} />
        <Route path="/login/verify" component={Verify} />
    </Switch>
)

export default LoginAPP
