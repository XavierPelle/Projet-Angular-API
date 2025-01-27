    const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class User extends Model {
}
User.init({
    firstName: {
        type: DataTypes.STRING(30),
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING(30),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    salt: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
});
module.exports = User;