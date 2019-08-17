import Sequelize from 'sequelize'
import * as hooks from './hooks'

export const name = 'CrossroadRegistry'

const fields = {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.DataTypes.UUIDV4,
    },
    extension: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    definition: {
        type: Sequelize.JSONB,
        allowNull: false,
    },
}

const options = {
    tableName: 'crossroad_registry',
    freezeTableName: true,
    underscored: true,
}


// export const init = async (conn, { createHook }) => {
export const init = (conn) => {
    // await createHook.serie(hooks.GRAPHQL_EXTENSIONS_REGISTRY_INIT_MODEL, { name, fields, options, conn })
    const Model = conn.define(name, fields, options)
    // await createHook.serie(hooks.GRAPHQL_EXTENSIONS_REGISTRY_DECORATE_MODEL, { name, fields, options, Model, conn })

    return Model.sync()
}

// export const reset = async (conn, Model) => {
//     await conn.handler.query(`TRUNCATE ${options.tableName} RESTART IDENTITY CASCADE;`)
// }
