/* eslint-disable */

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import { Switch, Route } from 'react-router-dom'

import { HomePage } from 'features/pages'
import { LoginAPP } from 'features/login'
import { JournalAPP } from 'features/journal'
import { Ui } from 'features/ui'

const mapState = ({ app, locale }) => ({
    name: app.name,
    locale: locale.locale.split('_')[0],
})

const App = ({ name, locale }) => (
    <>
        <Helmet>
            <html lang={locale} />
            <title>{name}</title>
        </Helmet>
        <Switch>
            <Route exact path="/" component={HomePage} />
            <Route path="/journal" component={JournalAPP} />
            <Route path="/login" component={LoginAPP} />
            <Route path="/ui" component={Ui} />
        </Switch>
    </>
)

App.propTypes = {
    name: PropTypes.string.isRequired,
    locale: PropTypes.string.isRequired,
}

export default connect(mapState)(App)
