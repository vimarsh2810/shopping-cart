const Sequelize = require('sequelize');

const sequelize = require('../config/db.js');

const WishListItem = sequelize.define('wishListItem', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  }
});

module.exports = { WishListItem };