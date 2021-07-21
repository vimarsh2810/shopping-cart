const Sequelize = require('sequelize');

const sequelize = require('../config/db.js');
const { Product } = require('./product.js');

const ProductImage = sequelize.define('productImage', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  path: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

ProductImage.belongsTo(Product, { onDelete: 'CASCADE' });
Product.hasMany(ProductImage);

module.exports = { ProductImage };