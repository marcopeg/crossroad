import React from 'react'
import PropTypes from 'prop-types'
import { data2list, data2map, newPart } from './utils'
import Input from './Input'

const isIOS = () => {
    const ua = navigator.userAgent
    const isIphone = ua.indexOf('iPhone') !== -1
    const isIpod = ua.indexOf('iPod') !== -1
    const isIpad = ua.indexOf('iPad') !== -1
    return isIphone || isIpod || isIpad
}

class Editor extends React.Component {
    constructor (props) {
        super(props)

        // prepare the content for editing an existing document or creating a new part
        const parts = (this.props.value && this.props.value.length) ? this.props.value : [newPart()]
        const list = data2list(parts)
        const map = data2map(parts)
        const refs = list.reduce((acc, curr) => ({ ...acc, [curr]: React.createRef() }), {})

        this.state = {
            list,
            map,
            refs,
        }
    }

    componentDidMount () {
        if (!isIOS()) {
            this.focus(this.state.list[this.state.list.length - 1], -1)
        }
    }

    getContent = () =>
        this.state.list
            .map(id => this.state.map[id])
            .filter(item => item.text.length > 0)

    focus = (id, position) => {
        clearTimeout(this.__focusTimer)
        this.__focusTimer = setTimeout(() => this.state.refs[id].current.focus(position))
    }

    triggerOnChange = (ref) => {
        this.props.onChange(this.getContent(), ref)
    }

    onInputChange = (id) => (text, ref) => {
        this.setState({ map: {
            ...this.state.map,
            [id]: {
                ...this.state.map[id],
                updatedAt: new Date(),
                text,
            },
        } })

        this.triggerOnChange(ref)
    }

    onRequestFocusPrev = (id) => () => {
        const idx = this.state.list.indexOf(id)
        const target = this.state.list[idx - 1]
        target && this.focus(target, -1)
    }

    onRequestFocusNext = (id) => () => {
        const idx = this.state.list.indexOf(id)
        const target = this.state.list[idx + 1]
        target && this.focus(target)
    }

    onRequestAddPart = (id) => () => {
        const part = newPart()

        const map = {
            ...this.state.map,
            [part.id]: part,
        }

        const refs = {
            ...this.state.refs,
            [part.id]: React.createRef(),
        }

        const list = [...this.state.list]
        list.splice(list.indexOf(id) + 1, 0, part.id)

        this.setState({ map, list, refs })
        this.focus(part.id)

        this.triggerOnChange()
    }

    onRequestDeletePart = (id) => () => {
        if (
            this.state.list.length <= 1
            || this.state.list.indexOf(id) === 0
        ) {
            return
        }

        const part = this.state.map[id]
        const idx = this.state.list.indexOf(id)
        const target = this.state.list[idx - 1]

        const map = { ...this.state.map }
        delete (map[id])

        const refs = { ...this.state.refs }
        delete (refs[id])

        const list = [...this.state.list]
        list.splice(idx, 1)

        // Update state and focus
        this.setState({ map, list, refs })

        // Append text to the previous element
        if (part.text.length > 0) {
            target && this.onInputChange(target)(this.state.map[target].text + part.text)
            target && this.focus(target, this.state.map[target].text.length)
        } else {
            target && this.focus(target, -1)
        }

        this.triggerOnChange()
    }

    render () {
        const { inputWrapper, inputStyle, inputClassName } = this.props
        const { style, className } = this.props
        const { list, map, refs } = this.state
        return (
            <div className={className} style={style}>
                {list.map(id => (
                    <Input
                        key={id}
                        ref={refs[id]}
                        {...map[id]}
                        onChange={this.onInputChange(id)}
                        requestFocusPrev={this.onRequestFocusPrev(id)}
                        requestFocusNext={this.onRequestFocusNext(id)}
                        requestAddPart={this.onRequestAddPart(id)}
                        requestDeletePart={this.onRequestDeletePart(id)}
                        wrapper={inputWrapper}
                        className={inputClassName}
                        style={inputStyle}
                    />
                ))}
            </div>
        )
    }
}

Editor.propTypes = {
    value: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        createdAt: PropTypes.instanceOf(Date).isRequired,
        updatedAt: PropTypes.instanceOf(Date).isRequired,
    })),
    className: PropTypes.any, // eslint-disable-line
    style: PropTypes.object, // eslint-disable-line
    inputWrapper: PropTypes.any, // eslint-disable-line
    inputClassName: PropTypes.any, // eslint-disable-line
    inputStyle: PropTypes.object,
    onChange: PropTypes.func,
}

Editor.defaultProps = {
    value: null,
    className: '',
    style: {},
    inputWrapper: undefined,
    inputClassName: undefined,
    inputStyle: undefined,
    onChange: () => {},
}

export default Editor
