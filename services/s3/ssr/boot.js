import { createHookApp } from '@forrestjs/hooks'
import { runQuery, setEndpoint, setHeader, setErrorMessage } from '@crossroad/client'

require('es6-promise').polyfill()
require('isomorphic-fetch')

export default createHookApp({
    // trace: true,
    settings: ({ setConfig }) => {
        setConfig('express.port', 5050)
        // setConfig('api.endpoint', 'http://localhost:8080/api')
        // setConfig('api.token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImV4dGVuc2lvbiI6IlRyZXZvcmJsYWRlcyJ9LCJuYW1lIjoiSm9obiBEb2UiLCJpYXQiOjE1MTYyMzkwMjJ9.n7C0HplzzKC7ZE4gyv6hQDiJj-7Ew3M5pGyQqQR0Mig') // eslint-disable-line

        // Setup @crossroad client
        setEndpoint('http://localhost:8080/api')
        setHeader('x-crossroad-origin', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImV4dGVuc2lvbiI6IlRyZXZvcmJsYWRlcyJ9LCJuYW1lIjoiSm9obiBEb2UiLCJpYXQiOjE1MTYyMzkwMjJ9.n7C0HplzzKC7ZE4gyv6hQDiJj-7Ew3M5pGyQqQR0Mig') // eslint-disable-line
        setErrorMessage('Oh, not this again!')
    },
    services: [
        require('@forrestjs/service-express'),
    ],
    features: [
        [
            '$EXPRESS_ROUTE',
            ({ registerRoute }) => {
                // Aggregate a single user's data
                registerRoute.get('/u/:userId', async (req, res) => {
                    try {
                        const query = await runQuery({
                            query: `query foo ($userId: ID!) {
                                S1 { name (id: $userId) }
                                S2 { age (id: $userId) }
                            }`,
                            variables: {
                                userId: req.params.userId,
                            },
                        })

                        query.throwHtmlError()

                        res.send([
                            `<h2>${query.data.S1.name}</h2>`,
                            `<p>age: ${query.data.S2.age}</p>`,
                            `<a href="/">Back</a>`,
                        ].join(''))
                    } catch (err) {
                        res.send(err.message)
                    }
                })

                // List users
                registerRoute.get('/', async (_, res) => {
                    try {
                        const query = await runQuery('{ S1 { users }}')
                        query.throwHtmlError()

                        const html = query.data.S1.users
                            .map(user => `<li><a href="/u/${user.id}">${user.name}</a></li>`)
                            .join('')

                        res.send(html)
                    } catch (err) {
                        res.send(err.message)
                    }
                })
            },
        ],
    ],
})
