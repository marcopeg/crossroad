import passport from 'passport'
import express from 'express'
import { POSTGRES_BEFORE_START } from '@forrestjs/service-postgres/lib/hooks'
import * as authSocialModel from './auth-social.model'
import * as hooks from './hooks'
import registerStrategy from './register-strategy'

export default ({ registerHook, registerAction, getEnv }) => {
    registerHook(hooks)

    // Add Auth Data Model
    registerAction({
        hook: `${POSTGRES_BEFORE_START}/default`,
        name: hooks.FEATURE_NAME,
        handler: ({ registerModel }) => {
            registerModel(authSocialModel)
        },
    })

    // Basic passport setup
    passport.serializeUser((user, done) => done(null, user))
    passport.deserializeUser((user, done) => done(null, user))

    const basicOptions = {
        baseUrl: getEnv('PASSPORT_BASE_URL'),
        loginUrl: '/login',
        successUrl: '/login/verify',
        errorUrl: '/login/error',
        registerAction,
    }

    registerAction({
        hook: '$EXPRESS_MIDDLEWARE',
        name: hooks.FEATURE_NAME,
        handler: ({ registerMiddleware }) => {
            const router = express.Router()

            registerStrategy(router, {
                ...basicOptions,
                provider: 'facebook',
                library: require('passport-facebook'),
                clientID: getEnv('FACEBOOK_CLIENT_ID'),
                clientSecret: getEnv('FACEBOOK_CLIENT_SECRET'),
            })

            registerStrategy(router, {
                ...basicOptions,
                provider: 'google',
                library: require('passport-google-oauth20'),
                clientID: getEnv('GOOGLE_CLIENT_ID'),
                clientSecret: getEnv('GOOGLE_CLIENT_SECRET'),
                clientOptions: { scope: ['profile'] },
            })

            registerStrategy(router, {
                ...basicOptions,
                provider: 'github',
                library: require('passport-github'),
                clientID: getEnv('GITHUB_CLIENT_ID'),
                clientSecret: getEnv('GITHUB_CLIENT_SECRET'),
            })

            registerStrategy(router, {
                ...basicOptions,
                provider: 'instagram',
                library: require('passport-instagram'),
                clientID: getEnv('INSTAGRAM_CLIENT_ID'),
                clientSecret: getEnv('INSTAGRAM_CLIENT_SECRET'),
            })

            router.get('/logout', async (req, res) => {
                await req.auth.logout()
                res.redirect('/login')
            })

            registerMiddleware('/auth', router)
        },
    })
}
