import Sequelize from 'sequelize'

export const name = 'CrossroadToken'

const fields = {
    extension: {
        type: Sequelize.STRING,
        primaryKey: true,
    },
    secret: {
        type: Sequelize.STRING,
        defaultValue: Sequelize.DataTypes.UUIDV4,
    },
    isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
    },
    validUntil: {
        type: Sequelize.DATE,
        allowNull: false,
    },
}

const options = {
    tableName: 'crossroad_tokens',
    freezeTableName: true,
    underscored: true,
}

const bump = (_, Model) => async id =>
    Model.increment('hits', { where: { id } })

export const init = (conn) => {
    const Model = conn.define(name, fields, options)
    Model.bump = bump(conn, Model)
    return Model.sync()
}

export const reset = async (conn, Model) => {
    await conn.handler.query(`TRUNCATE ${options.tableName} RESTART IDENTITY CASCADE;`)
}
