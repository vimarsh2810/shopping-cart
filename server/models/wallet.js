const sequelize = require('../config/db.js');

const Sequelize = require('sequelize');
const { User } = require('./user.js');

const Wallet = sequelize.define('wallet', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  balance: {
    type: Sequelize.DECIMAL
  }
});

Wallet.belongsTo(User);
User.hasOne(Wallet);

module.exports = { Wallet };