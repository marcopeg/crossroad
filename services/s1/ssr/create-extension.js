import { createExtension } from '@crossroad/client'

export default staticSignature => createExtension({
    name: 'S1',
    endpoint: 'http://localhost:8080/api',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImV4dGVuc2lvbiI6IlMxIn0sImlhdCI6MTU2NTcwMzAyNiwiZXhwIjozMzA5MTc0NTQyNn0.MIJEI5tgKgyXthBUmRrRTHT8FWRygqGMTVYRy7AeiP4', // eslint-disable-line
    variables: [
        { name: 'serviceUrl', value: 'http://localhost:6060' },
        { name: 'staticSignature', value: staticSignature },
    ],
    headers: [
        { name: 'x-crossroad-signature', value: 'meta.signature' },
        { name: 'x-static-signature', value: 'staticSignature' },
    ],
    definition: {
        queryWrapper: {
            args: [
                { name: 'xCrossroadOrigin', type: 'String' },
            ],
        },
        queries: [
            {
                name: 'users',
                type: 'JSON',
                resolve: {
                    type: 'rest',
                    url: '{{ serviceUrl }}/users',
                },
            },
            {
                name: 'name',
                type: 'String',
                args: [
                    { name: 'id', type: 'ID!' },
                ],
                resolve: {
                    type: 'rest',
                    url: '{{ serviceUrl }}/users/{{ args.id }}',
                    grab: 'name',
                },
            },
        ],
        rules: [
            { name: 'originNotNull' },
            { name: 'originWhiteList', options: { accept: ['Trevorblades'] } },
        ],
    },
})
