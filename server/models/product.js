const Sequelize = require('sequelize');

const sequelize = require('../config/db.js');
const { Category } = require('./category.js');
const { User } = require('./user.js');

const Product = sequelize.define('product', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  title: {
    type: Sequelize.STRING(40),
    unique: true,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING
  },
  price: {
    type: Sequelize.DECIMAL
  },
  imagePath: {
    type: Sequelize.STRING
  }
});

Product.belongsTo(User);
User.hasMany(Product);

Product.belongsTo(Category);
Category.hasMany(Product);

module.exports = { Product };