import passport from 'passport'
import { getModel } from '@forrestjs/service-postgres'

export default (router, {
    provider,
    library,
    clientID,
    clientSecret,
    clientOptions = {},
    baseUrl = 'https://colibri.ngrok.io',
    loginUrl = '/login',
    successUrl = '/login/verify',
    errorUrl = '/login/error',
}) => {
    // Configure the strategy
    passport.use(new library.Strategy({
        clientID,
        clientSecret,
        callbackURL: `${baseUrl}/auth/${provider}/callback`,
    },
    (accessToken, refreshToken, profile, cb) => cb(null, {
        id: profile.id,
        provider,
    })))

    // Initializes the authentication loop toward instagram
    router.get(`/${provider}`, passport.authenticate(provider, clientOptions))

    // Handles the authentication process in order to:
    // - identify or create an account linked with the social identity
    // - decorate the running session with that account
    router.get(`/${provider}/callback`, [
        (req, res, next) => {
            passport.authenticate(provider, async (err, user) => {
                if (err) {
                    console.log('err>>', err.message)
                    console.log(err)
                    res.redirect(`${baseUrl}${errorUrl}`)
                    return
                }

                if (!user) {
                    console.log('LOGIN FAILED')
                    res.redirect(`${baseUrl}${loginUrl}`)
                    return
                }

                // Find or generate related models
                // -- move this inside the model?
                let authAccount = null
                let authSocial = null

                authSocial = await getModel('AuthSocial').findOne({
                    where: {
                        providerName: user.provider,
                        providerId: user.id,
                    },
                })

                if (!authSocial) {
                    authAccount = await getModel('AuthAccount').create({
                        status: 1,
                        payload: {
                            origin: `${user.provider}/${user.id}`,
                        },
                    })

                    authSocial = await getModel('AuthSocial').create({
                        providerName: user.provider,
                        providerId: user.id,
                        authId: authAccount.id,
                    })
                } else {
                    authAccount = await getModel('AuthAccount').findOne({
                        where: { id: authSocial.authId },
                    })
                }

                // Decorate the session JWT with the identity informations.
                const auth = { auth_id: authAccount.id, auth_etag: authAccount.etag }
                await req.session.validate()
                await req.session.set(auth)
                await req.session.write(auth)

                // Register last login
                await getModel('AuthAccount').bumpLastLogin(authAccount.id)

                res.redirect(`${baseUrl}${successUrl}`)
            })(req, res, next)
        },
    ])
}
