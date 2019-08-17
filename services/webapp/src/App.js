/* eslint-disable */

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import { Switch, Route } from 'react-router-dom'

import { HomePage } from 'features/pages'

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
        </Switch>
    </>
)

App.propTypes = {
    name: PropTypes.string.isRequired,
    locale: PropTypes.string.isRequired,
}

export default connect(mapState)(App)
