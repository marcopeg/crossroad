export const services = [
    require('./auth.service'),
]

export const reducers = {
    auth: require('./auth.reducer').default,
}

export { default as Login } from './Login'
export { default as LoginAPP } from './LoginAPP'
export { default as withAuth } from './with-auth'
