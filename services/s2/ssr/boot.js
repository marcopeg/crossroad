import { createHookApp } from '@forrestjs/hooks'
import { GraphQLInt, GraphQLID, GraphQLNonNull, GraphQLObjectType } from 'graphql'
import { createExtension } from '@crossroad/client'

require('es6-promise').polyfill()
require('isomorphic-fetch')

const users = [
    { id: 'dv', age: 74 },
    { id: 'ls', age: 55 },
]

export default createHookApp({
    // trace: true,
    settings: ({ setConfig, setContext }) => {
        setConfig('express.port', 7070)
        setContext('extension', createExtension({
            name: 'S2',
            endpoint: 'http://localhost:8080/api',
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImV4dGVuc2lvbiI6IlMyIn0sIm5hbWUiOiJKb2huIERvZSIsImlhdCI6MTUxNjIzOTAyMn0.XlcAlTdLGfT6DhDyhY1fVY6br3oXt_0iaid3S6WuZE0', // eslint-disable-line
            variables: { serviceUrl: 'http://localhost:7070' },
            headers: [
                { name: 'x-crossroad-signature', value: 'meta.signature' },
            ],
            definition: {
                queryWrapper: { args: [{ name: 'xCrossroadOrigin', type: 'String' }] },
                queries: [
                    {
                        name: 'age',
                        type: 'Int!',
                        args: [{ name: 'id', type: 'ID!' }],
                        resolve: {
                            type: 'graphql',
                            url: '{{ serviceUrl }}/api',
                            query: 'query foo ($id: ID!) { user (id: $id) { age }}',
                            variables: [{ name: 'id', value: 'args.id' }],
                            grab: 'data.user.age',
                        },
                    },
                ],
                rules: [
                    { name: 'originNotNull' },
                    { name: 'originWhiteList', options: { accept: ['Trevorblades'] } },
                ],
            },
        }))
    },
    services: [
        require('@forrestjs/service-express'),
        require('@forrestjs/service-express-graphql'),
    ],
    features: [
        //////////////////////
        // Service's APIs
        [
            '$EXPRESS_GRAPHQL',
            ({ registerQuery }, { extension }) =>
                registerQuery('user', {
                    args: {
                        id: { type: new GraphQLNonNull(GraphQLID) },
                    },
                    type: new GraphQLObjectType({
                        name: 'User',
                        fields: {
                            id: { type: new GraphQLNonNull(GraphQLID) },
                            age: { type: new GraphQLNonNull(GraphQLInt) },
                        },
                    }),
                    resolve: async (_, args, { req }) => {
                        // throw new Error('foo')
                        await extension.validateRequest(req)
                        return users.find(u => u.id === args.id)
                    },
                }),
        ],

        //////////////////////
        // Register the extension
        [
            '$START_SERVICE',
            async ({ extension }) =>
                extension.register()
                    .then(() => console.log('Extension successfully registered'))
                    .catch(err => console.log(`Failed to register the extension - ${err.message}`)),
        ],
    ],
})
