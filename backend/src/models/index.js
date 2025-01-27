const sequelize = require('../config/database');
const User = require('./User');
const Post = require('./Post');

User.hasMany(Post, {
    foreignKey: 'userId',
    as: 'posts'
});

Post.belongsTo(User, {
    foreignKey: 'userId',
    as: 'author'
});

const syncDatabase = async () => {
    try {
        await sequelize.sync({ force: true });
        console.log('La base de données et les tables sont synchronisées et recréées à chaque démarrage.');
    } catch (error) {
        console.error('Erreur lors de la synchronisation de la base de données:', error);
    }
};

module.exports = {
    sequelize,
    User,
    Post,
    syncDatabase
};
