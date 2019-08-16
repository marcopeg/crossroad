import { getModel } from '@forrestjs/service-postgres'
import { generate } from 'generate-password'
import { name as MODEL_NAME } from './journal-entry.model'

const SESSION_KEY = 'journal_key'

export const rand = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

export const encryptKey = async (req, value) => {
    // calculate a random password that is used to encrypt the user's PIN
    const password = generate({ length: rand(27, 60), numbers: true, uppercase: true })
    const encrypted = await getModel(MODEL_NAME).encryptValue({
        key: password,
        val: value,
    })

    // store the pair of key and password in session
    await req.session.write(SESSION_KEY, password)
    await req.session.set(SESSION_KEY, encrypted)

    return encrypted
}

export const decryptKey = async (req) => {
    const encryptedKey = await req.session.get(SESSION_KEY)
    const password = await req.session.read(SESSION_KEY)
    return getModel(MODEL_NAME).decryptValue({ key: password, val: encryptedKey })
}

export const cleanSession = async (req) => {
    await req.session.unset(SESSION_KEY)
    await req.session.delete(SESSION_KEY)
}
