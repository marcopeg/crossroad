/* eslint-disable */
import React from 'react'
import KeyboardPadding from 'components/KeyboardPadding'

const Test1 = () => (
    <KeyboardPadding>
        {({ height }) => (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                backgroundColor: 'red',
                // height: window.innerHeight,
                overflow: 'auto',
                WebkitOverflowScrolling: 'touch',
            }}>
                <p>start</p>
                <p>a</p>
                <p>a</p>
                <p>a</p>
                <p>a</p>
                <p>a</p>
                <p>a</p>
                <p>a</p>
                <p>b</p>
                <p>b</p>
                <p>b</p>
                <p>b</p>
                <p>b</p>
                <p>b</p>
                <p>b</p>
                <p>b</p>
                <p>b</p>
                <p>b</p>
                <p>b</p>
                <p>b</p>
                <p>b</p>
                <p>b</p>
                <p>b</p>
                <p>b</p>
                {height}
                <input type="text" style={{ border: '1px solid black' }} />
                <p>c</p>
                <p>c</p>
                <p>c</p>
                <p>c</p>
            </div>
        )}
    </KeyboardPadding>
)

export default Test1
