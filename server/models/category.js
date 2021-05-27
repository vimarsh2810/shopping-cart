const Sequelize = require('sequelize');

const sequelize = require('../config/db.js');
const { User } = require('./user.js');

const Category = sequelize.define('category', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  title: {
    type: Sequelize.STRING(40),
    unique: true
  }
});

Category.hasMany(Category, { as: 'children', foreignKey: 'parentId' });
Category.belongsTo(Category, { as: 'parent', foreignKey: 'parentId' });

Category.belongsTo(User);
User.hasMany(Category);

module.exports = { Category };