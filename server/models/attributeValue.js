const Sequelize = require('sequelize');
const sequelize = require('../config/db.js');

const AttributeValue = sequelize.define('attributeValue', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  value: {
    type: Sequelize.STRING(30),
    allowNull: false
  },
  hex: {
    type: Sequelize.STRING,
    allowNull: true,
    unique: true
  }
});

module.exports = { AttributeValue };