const Sequelize = require('sequelize');

const sequelize = require('../config/db.js');
const { User } = require('./user.js');
const { Product } = require('./product.js');
const { CartItem } = require('./cartItem.js');

const Cart = sequelize.define('cart', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement:true,
    allowNull: false
  }
});

Cart.belongsTo(User, { onDelete: 'CASCADE' });
User.hasOne(Cart);

Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

module.exports = { Cart };