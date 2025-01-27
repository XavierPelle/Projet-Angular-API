const { Model,DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Post extends Model {}

Post.init({
    title: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Post',
    tableName: 'posts',
});

module.exports = Post;
