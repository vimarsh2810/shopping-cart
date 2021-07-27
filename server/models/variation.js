const Sequelize = require('sequelize');
const sequelize = require('../config/db.js');
const { Attribute } = require('./attribute.js');
const { AttributeValue } = require('./attributeValue.js');
const { Product } = require('./product.js');

const Variation = sequelize.define('variation', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  }
});

Variation.belongsTo(Product);
Product.hasMany(Variation);
Variation.belongsTo(AttributeValue);
AttributeValue.hasMany(Variation);

module.exports = { Variation };