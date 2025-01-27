const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class User extends Model {
}
User.init({
    email: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true
    },
    role: {
        type: DataTypes.STRING(30),
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    salt: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    tokenAccess: {
        type: DataTypes.TEXT('long') ,
        allowNull: true,
    },
    tokenRefresh: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
    }
}, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
});

module.exports = User;