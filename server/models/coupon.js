const sequelize = require('../config/db.js');

const Sequelize = require('sequelize');
const { User } = require('./user.js');

const Coupon = sequelize.define('coupon', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  code: {
    type: Sequelize.STRING(30),
    allowNull: false,
    unique: true
  },
  isUsed: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
    allowNull: false
  }
});

Coupon.belongsTo(User, { onDelete: 'CASCADE' });
User.hasOne(Coupon);

module.exports = { Coupon };