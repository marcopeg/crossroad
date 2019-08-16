import { createHookApp } from '@forrestjs/hooks'
import createExtension from './create-extension'
import { HttpError } from '@crossroad/client'

require('es6-promise').polyfill()
require('isomorphic-fetch')

const users = [
    { id: 'dv', name: 'Darth Vader' },
    { id: 'ls', name: 'Luke Skywalker' },
]

export const validateStaticHeader = (value, {
    header = 'x-static-signature',
    statusCode = 400,
    statusMessage = 'Invalid Static Signature',
} = {}) =>
    (req, res, next) => {
        if (req.headers[header] === value) {
            next()
        } else {
            res.statusMessage = statusMessage
            res.status(statusCode).end()
        }
    }

export default createHookApp({
    // trace: true,
    settings: ({ setConfig, getConfig, setContext }) => {
        setConfig('express.port', 6060)
        setConfig('staticSignature', '123')
        setContext('extension', createExtension(getConfig('staticSignature')))
    },
    services: [
        require('@forrestjs/service-express'),
    ],
    features: [
        // User's Routes
        [
            '$EXPRESS_ROUTE',
            ({ registerRoute }, { getConfig, extension }) => {
                registerRoute.get('/users/:id', [
                    validateStaticHeader(getConfig('staticSignature')),
                    extension.createMiddleware(),
                    // () => HttpError.throw('Example Error', 418),
                    (req, res) => res.json(users.find(u => u.id === req.params.id)),
                ])

                registerRoute.get('/users', [
                    validateStaticHeader(getConfig('staticSignature')),
                    extension.createMiddleware(),
                    // () => HttpError.throw('Example Error', 418),
                    (req, res) => res.json(users),
                ])
            },
        ],

        // Handle App's throws and turn them into status codes with custom
        // statusMessage for a nice error propagation
        [
            '$EXPRESS_HANDLER',
            ({ registerHandler }) => registerHandler(HttpError.createHandler()),
        ],

        // Register the extension at boot time
        [
            '$START_SERVICE',
            async ({ getContext }) => {
                getContext('extension').register()
                    .then(() => {
                        console.log('Extension successfully registered')
                        // setInterval(() => getConfig('extension').rotateSecret(), 2500)
                    })
                    .catch(err => console.log(`Failed to register the extension - ${err.message}`))
            },
        ],
    ],
})
