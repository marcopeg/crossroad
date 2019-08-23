const express = require('express')

export default ({ registerAction }) => {
    registerAction({
        hook: '$EXPRESS_MIDDLEWARE',
        handler: ({ registerMiddleware }) =>
            registerMiddleware(express.static('node_build/app')),
    })
}
