# @crossroad/client

- register a crossroad extension
- query a crossroad server

## createExtension()

```js
import { createExtension } from '@crossroad/client'

createExtension({
    // Target a @crossroad API server:
    endpoint: 'http://crossroad-server.com',
    token: 'extension-secret-token',

    // Describe your extension:
    name: 'Foo',
    secret: 'xxx',

    // Variables can be used in the definition as first class placeholders
    variables: [
        { name: 'var1', value: 'xxx' },
        { name: 'var2', value: 'yyy' },
    ],
    
    // Headers are prepended to each endpoint definition, value can use variables
    variables: [
        { name: 'x-foo', value: 'var1' },
        { name: 'x-aaa', value: '{{ var1 }}/{{ var2 }}' },
    ],

    // Extension definition as in @marcopeg/graphql-extension
    definition: { ... },
})
```

#### secret

Used by @crossroad to generate a `meta.signature` token that can be verified by the client.  
You can then protect your routes with `extension.createMiddleware()`

#### variables

Every item that you define into `variables` will be available for templating in the rest of
the definition, along with the values that are provided by the `@crossroad` server at evaluation time.

- meta.origin
- meta.signature
- root.xxx
- args.xxx

## runQuery()

```js
import { runQuery } from '@crossroad/client'
runQuery({
    query: 'query foo (@name: String!) { Ext1 { name(name:$name) }}', 
    variables: { name: 'foo' },
    endpoint: 'http://crossroad-server.com',
    headers: {
        'x-grapi-origin': 'client token'
    },
})
```

## HttpError

Custom error utility that play nicely with an Express error handler.  
(to be completed)


