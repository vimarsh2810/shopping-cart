const Sequelize = require('sequelize');

const sequelize = require('../config/db.js');

const OrderItem = sequelize.define('orderItem', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  quantity: {
    type: Sequelize.INTEGER
  }
});

module.exports = { OrderItem };