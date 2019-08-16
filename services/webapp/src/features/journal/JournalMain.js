import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withAuth, Login } from 'features/login'
import { Link } from 'react-router-dom'
import { fetchJournal, saveJournal, checkPin, savePin } from './journal.service'

import AskPin from './AskPin'
import JournalWrite from './JournalWrite'

const mapState = ({ journal }) => ({
    hasPin: journal.pin !== null,
})

const mapDispatch = {
    checkPin,
    savePin,
    fetchJournal,
    saveJournal,
}

class JournalMain extends React.Component {
    componentDidMount () {
        this.props.checkPin()
    }

    render () {
        const { hasPin, savePin, ...props } = this.props
        const body = hasPin
            ? <JournalWrite {...props} />
            : <AskPin onSubmit={savePin} />

        return (
            <div style={{
                // position: 'fixed',
                // top: 0,
                // left: 0,
                // bottom: 0,
                // right: 0,
                // backgroundColor: 'red',
                // overflow: 'auto',
                // WebkitOverflowScrolling: 'touch',
            }}>
                <Link to="/">Back</Link>
                <hr />
                {body}
            </div>
        )
    }
}

JournalMain.propTypes = {
    hasPin: PropTypes.bool.isRequired,
    savePin: PropTypes.func.isRequired,
    checkPin: PropTypes.func.isRequired,
}

export default connect(mapState, mapDispatch)(withAuth({ fallback: Login })(JournalMain))
