import Sequelize from 'sequelize'
import * as hooks from './hooks'

export const name = 'SessionHistory'

const fields = {
    createdAt: {
        type: Sequelize.DATE,
        primaryKey: true,
    },
    url: {
        type: Sequelize.TEXT,
        primaryKey: true,
    },
    sessionId: {
        type: Sequelize.UUID,
        primaryKey: true,
    },
    deviceId: {
        type: Sequelize.UUID,
    },
    requestId: {
        type: Sequelize.UUID,
    },
    data: {
        type: Sequelize.JSONB,
        allowNull: false,
    },
    graphql: {
        type: Sequelize.JSONB,
        allowNull: true,
    },
}

const options = {
    tableName: 'session_history',
    freezeTableName: true,
    underscored: true,
    createdAt: false,
    updatedAt: false,
}


export const init = async (conn, { createHook }) => {
    await createHook.serie(hooks.PG_SESSION_HISTORY_INIT_MODEL, { name, fields, options, conn })
    const Model = conn.define(name, fields, options)
    await createHook.serie(hooks.PG_SESSION_HISTORY_DECORATE_MODEL, { name, fields, options, Model, conn })
    return Model.sync()
}
