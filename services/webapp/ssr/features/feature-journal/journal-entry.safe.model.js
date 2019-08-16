import Sequelize from 'sequelize'

export const name = 'JournalEntry'

const fields = {
    accountId: {
        primaryKey: true,
        type: Sequelize.UUID,
    },
    day: {
        primaryKey: true,
        type: Sequelize.DATEONLY,
        defaultValue: new Date(),
    },
    content: {
        type: Sequelize.TEXT,
        defaultValue: '{}',
    },
}

const options = {
    tableName: 'journal_entries',
    freezeTableName: true,
    underscored: true,
}

const upsertEncrypted = (conn, Model, encryptionKey) =>
    async ({ accountId, day, content }, userEncryptionKey) =>
        Model.upsert({
            accountId,
            day,
            // Wrap with systemKey(userKey(plain_data))
            content: Sequelize.fn(
                'PGP_SYM_ENCRYPT',
                Sequelize.cast(Sequelize.fn(
                    'PGP_SYM_ENCRYPT',
                    JSON.stringify(content),
                    userEncryptionKey
                ), 'text'),
                encryptionKey
            ),
        }, {
            where: {
                accountId,
                day,
            },
            returning: true,
        })

const findOneEncrypted = (conn, Model, encryptionKey) =>
    async ({ accountId, day }, userEncryptionKey) => {
        const data = await Model.findOne({
            where: {
                accountId,
                day,
            },
            attributes: [
                [ 'account_id', 'accountId' ],
                'day',
                // Unwrap with userKey(systemKey(encrypted_data))
                [
                    Sequelize.fn(
                        'PGP_SYM_DECRYPT',
                        Sequelize.cast(Sequelize.fn(
                            'PGP_SYM_DECRYPT',
                            Sequelize.cast(Sequelize.col('content'), 'bytea'),
                            encryptionKey
                        ), 'bytea'),
                        userEncryptionKey
                    ),
                    'content',
                ],
                [ 'created_at', 'createdAt' ],
                [ 'updated_at', 'updatedAt' ],
            ],
            raw: true,
        })

        return data ? {
            ...data,
            content: JSON.parse(data.content),
        } : null
    }

const updateUserEncryptionKey = (conn, Model, encryptionKey) =>
    async ({ accountId, key, newKey }) =>
        Model.update({
            content: Sequelize.fn(
                'PGP_SYM_ENCRYPT',
                Sequelize.cast(Sequelize.fn(
                    'PGP_SYM_ENCRYPT',
                    Sequelize.fn(
                        'PGP_SYM_DECRYPT',
                        Sequelize.cast(Sequelize.fn(
                            'PGP_SYM_DECRYPT',
                            Sequelize.cast(Sequelize.col('content'), 'bytea'),
                            encryptionKey
                        ), 'bytea'),
                        key
                    ),
                    newKey
                ), 'text'),
                encryptionKey
            ),
        }, { where: { accountId } })

const encryptValue = (conn, Model) =>
    async ({ key, val }) => {
        const res = await conn.query(`SELECT PGP_SYM_ENCRYPT('${val}', '${key}')::text as value;`)
        return res[0][0]['value']
    }

const decryptValue = (conn, Model) =>
    async ({ key, val }) => {
        const res = await conn.query(`SELECT PGP_SYM_DECRYPT('${val}'::bytea, '${key}')::text as value;`)
        return res[0][0]['value']
    }

export const init = async (conn, { getEnv }) => {
    const encryptionKey = getEnv('PG_ENCRYPTION_KEY')

    const Model = conn.define(name, fields, options)
    Model.upsertEncrypted = upsertEncrypted(conn, Model, encryptionKey)
    Model.findOneEncrypted = findOneEncrypted(conn, Model, encryptionKey)
    Model.updateUserEncryptionKey = updateUserEncryptionKey(conn, Model, encryptionKey)
    Model.encryptValue = encryptValue(conn, Model)
    Model.decryptValue = decryptValue(conn, Model)

    await conn.query('CREATE EXTENSION IF NOT EXISTS pgcrypto;')
    return Model.sync()
}
