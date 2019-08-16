import React from 'react'
import PropTypes from 'prop-types'

const isInViewport = elem => {
    var bounding = elem.getBoundingClientRect()
    return (
        bounding.top >= 0
        && bounding.left >= 0
        && bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight)
        && bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
    )
}

class ScrollToBottom extends React.PureComponent {
    constructor (props) {
        super(props)
        this.el = React.createRef()
        this.clock = null
    }

    componentDidMount () {
        window.addEventListener('scroll', this.scrollHandler, true)
        this.clock = setInterval(this.scrollToBottom, this.props.interval)
    }

    componentWillUnmount () {
        clearInterval(this.clock)
        window.removeEventListener('scroll', this.scrollHandler)
    }

    scrollHandler = (e) => {
        clearInterval(this.clock)

        // check if restart the magnetic behavior
        clearTimeout(this.restartTimer)
        this.restartTimer = setTimeout(() => {
            if (isInViewport(this.el.current)) {
                this.clock = setInterval(this.scrollToBottom, this.props.interval)
            }
        }, 250)
    }

    scrollToBottom = () => this.el.current.scrollIntoView({ behavior: this.props.behavior })

    render () {
        return (
            <div ref={this.el} />
        )
    }
}

ScrollToBottom.propTypes = {
    interval: PropTypes.number,
    behavior: PropTypes.oneOf([ 'auto', 'smooth' ]),
}

ScrollToBottom.defaultProps = {
    interval: 50,
    behavior: 'auto',
}

export default ScrollToBottom
