# @crossroad/schema

This service extends `@forrestjs/service-express-graphql` and allows to dynamically
extend the running `GraphQLSchema` with **extensions** using `graphql-extension` package
to parse the extension definition.

An extension looks something like:

```json
{
  "name": "ExtensionName",
  "queries": {
    "users": {
      "type": "JSON",
      "resolve": {
        "type": "rest",
        "url": ""
      }
    }
  }
}
```

and you can add this to the schema with the follwing mutation:

```gql
mutation extendSchema {
    registerExtensionJSON(definition: { ... })
}
```

finally you can query the extension:

```gql
query getUsers {
  ExtensionName {
    users
  }
}
```
