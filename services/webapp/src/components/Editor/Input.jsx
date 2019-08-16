import React from 'react'
import PropTypes from 'prop-types'
import TextareaAutosize from 'react-textarea-autosize'

class Input extends React.Component {
    constructor (props) {
        super(props)
        this.ref = React.createRef()
    }

    focus = (position) => {
        try {
            this.ref.current.focus()
            if (position === -1) {
                this.ref.current.selectionStart = this.props.text.length
            } else {
                this.ref.current.selectionStart = position
                this.ref.current.selectionEnd = position
            }
        } catch (err) {
            console.error(`Input::focus() - ${err.message}`)
        }
    }

    onKeyDown = (evt) => {
        const { text: currentText } = this.props
        const { requestFocusPrev, requestFocusNext, requestAddPart, requestDeletePart } = this.props
        const currentRef = this.ref.current

        // arrow left || arrow up
        if (
            (evt.keyCode === 37 || evt.keyCode === 38)
            && currentRef.selectionStart === 0
        ) {
            requestFocusPrev()
        }

        // arrow right || arrow down
        if (
            (evt.keyCode === 39 || evt.keyCode === 40)
            && currentRef.selectionStart === currentText.length
        ) {
            requestFocusNext()
        }

        // enter
        if (evt.keyCode === 13) {
            evt.preventDefault()
            evt.stopPropagation()

            // Prevent adding new parts if the input is empty
            if (currentText.length <= 0) {
                return
            }

            // Add new part only if it is at the end of the current input
            if (currentRef.selectionStart === currentText.length) {
                requestAddPart()
            }
        }

        // backspace
        if (
            evt.keyCode === 8
            && currentRef.selectionStart === 0
            && currentRef.selectionStart === currentRef.selectionEnd
        ) {
            requestDeletePart()
        }
    }

    render () {
        const { text, onChange, wrapper, style, className } = this.props
        return wrapper(
            <TextareaAutosize
                inputRef={this.ref}
                value={text}
                onKeyDown={this.onKeyDown}
                onChange={evt => onChange(evt.target.value, this.ref)}
                className={className}
                style={style}
            />
        )
    }
}

Input.propTypes = {
    text: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    requestFocusPrev: PropTypes.func.isRequired,
    requestFocusNext: PropTypes.func.isRequired,
    requestAddPart: PropTypes.func.isRequired,
    requestDeletePart: PropTypes.func.isRequired,
    wrapper: PropTypes.any, // eslint-disable-line
    className: PropTypes.any, // eslint-disable-line
    style: PropTypes.object, // eslint-disable-line
}

Input.defaultProps = {
    wrapper: children => <div>{children}</div>,
    className: '',
    style: {},
}

export default Input
