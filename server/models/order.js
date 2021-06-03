const Sequelize = require('sequelize');

const sequelize = require('../config/db.js');
const { User } = require('./user.js');
const { Product } = require('./product.js');
const { OrderItem } = require('./orderItem.js');

const Order = sequelize.define('order', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  amount: {
    type: Sequelize.DECIMAL
  },
  deliveryOtp: {
    type: Sequelize.INTEGER
  },
  status: {
    type: Sequelize.STRING(20)
  }
});

Order.belongsTo(User);
User.hasMany(Order);

Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });

module.exports = { Order };