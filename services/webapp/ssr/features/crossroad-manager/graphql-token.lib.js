import Sequelize from 'sequelize'
import { getModel } from '@forrestjs/service-postgres'
import * as jwt from '@forrestjs/service-jwt'

const sign = (extension, secret) =>
    jwt.sign({ extension }, {
        expiresIn: '999y',
    }, secret)

export const issue = async ({ extension, duration }) => {
    // issue the new token for the specific extension name
    const token = await getModel('CrossroadToken').upsert({
        extension,
        validUntil: Sequelize.literal(`NOW() + INTERVAL '${duration}'`),
    }, { returning: true })

    // create the JWT
    return sign(token[0].extension, token[0].secret)
}

export const validate = async ({ token, extension }) => {
    const record = await getModel('CrossroadToken').findOne({
        where: {
            extension: { [Sequelize.Op.like]: extension },
            isActive: true,
            validUntil: { [Sequelize.Op.gte]: Sequelize.literal('NOW()') },
        },
        raw: true,
        attributes: ['secret'],
    })

    if (!record) {
        throw new Error(`[graphql-extensions-manager] Invalid or expired token`)
    }

    try {
        await jwt.verify(token, record.secret)
    } catch (err) {
        throw new Error(`[graphql-extensions-manager] Invalid token`)
    }

    return extension
}

export const get = async (extension) => {
    const record = await getModel('CrossroadToken').findOne({
        where: {
            extension: { [Sequelize.Op.like]: extension },
            isActive: true,
            validUntil: { [Sequelize.Op.gte]: Sequelize.literal('NOW()') },
        },
        raw: true,
        attributes: ['secret'],
    })

    if (!record) {
        throw new Error(`[graphql-extensions-manager] Invalid or expired token`)
    }

    return sign(extension, record.secret)
}
