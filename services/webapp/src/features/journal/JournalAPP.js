/* eslint-disable */
import React from 'react'
import { Switch, Route } from 'react-router-dom'
import JournalMain from './JournalMain'

const JournalAPP = () => (
    <Switch>
        <Route path="/journal/:day?" component={JournalMain} />
    </Switch>
)

export default JournalAPP
