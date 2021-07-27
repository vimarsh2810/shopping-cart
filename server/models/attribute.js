const sequelize = require('../config/db.js');
const Sequelize = require('sequelize');
const { AttributeValue } = require('./attributeValue.js');

const Attribute = sequelize.define('attribute', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  title: {
    type: Sequelize.STRING(20),
    unique: true,
    allowNull: false
  }
});

AttributeValue.belongsTo(Attribute);
Attribute.hasMany(AttributeValue);

module.exports = { Attribute };