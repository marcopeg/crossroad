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

const upsertEncrypted = Model =>
    async ({ accountId, day, content }, userEncryptionKey) =>
        Model.upsert({
            accountId,
            day,
            // Wrap with systemKey(userKey(plain_data))
            content: Sequelize.fn(
                'PGP_SYM_ENCRYPT',
                JSON.stringify(content),
                userEncryptionKey
            ),
        }, {
            where: {
                accountId,
                day,
            },
            returning: true,
        })

const findOneEncrypted = Model =>
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
                        Sequelize.cast(Sequelize.col('content'), 'bytea'),
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

const updateUserEncryptionKey = Model =>
    async ({ accountId, key, newKey }) =>
        Model.update({
            content: Sequelize.fn(
                'PGP_SYM_ENCRYPT',
                Sequelize.fn(
                    'PGP_SYM_DECRYPT',
                    Sequelize.cast(Sequelize.col('content'), 'bytea'),
                    key
                ),
                newKey
            ),
        }, { where: { accountId } })

const encryptValue = (conn) =>
    async ({ key, val }) => {
        const res = await conn.query(`SELECT PGP_SYM_ENCRYPT('${val}', '${key}')::text as value;`)
        return res[0][0]['value']
    }

const decryptValue = (conn) =>
    async ({ key, val }) => {
        const res = await conn.query(`SELECT PGP_SYM_DECRYPT('${val}'::bytea, '${key}')::text as value;`)
        return res[0][0]['value']
    }

export const init = async conn => {
    const Model = conn.define(name, fields, options)
    Model.upsertEncrypted = upsertEncrypted(Model)
    Model.findOneEncrypted = findOneEncrypted(Model)
    Model.updateUserEncryptionKey = updateUserEncryptionKey(Model)
    Model.encryptValue = encryptValue(conn)
    Model.decryptValue = decryptValue(conn)

    await conn.query('CREATE EXTENSION IF NOT EXISTS pgcrypto;')
    return Model.sync()
}
