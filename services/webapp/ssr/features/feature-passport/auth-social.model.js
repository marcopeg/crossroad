import Sequelize from 'sequelize'

export const name = 'AuthSocial'

const fields = {
    providerName: {
        type: Sequelize.STRING,
        primaryKey: true,
    },
    providerId: {
        type: Sequelize.STRING,
        primaryKey: true,
    },
    authId: {
        type: Sequelize.UUID,
        primaryKey: true,
    },
}

const options = {
    tableName: 'auth_social_providers',
    freezeTableName: true,
    underscored: true,
}


export const init = (conn) => {
    const Model = conn.define(name, fields, options)
    return Model.sync()
}
