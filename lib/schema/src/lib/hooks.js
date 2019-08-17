import { SERVICE } from '@forrestjs/hooks'
export const SERVICE_NAME = `${SERVICE} crossroad/schema`

export const GRAPHQL_EXTENSION_START = `${SERVICE_NAME}/init`
export const GRAPHQL_EXTENSION_VALIDATE = `${SERVICE_NAME}/validate`
export const GRAPHQL_EXTENSION_REGISTER = `${SERVICE_NAME}/register`
