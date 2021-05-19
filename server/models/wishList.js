const Sequelize = require('sequelize');

const sequelize = require('../config/db.js');
const { User } = require('./user.js');
const { Product } = require('./product.js');
const { WishListItem } = require('./wishListItem.js');

const WishList = sequelize.define('wishList', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement:true,
    allowNull: false
  }
});

WishList.belongsTo(User, { onDelete: 'CASCADE' });
User.hasOne(WishList);

WishList.belongsToMany(Product, { through: WishListItem });
Product.belongsToMany(WishList, { through: WishListItem });

module.exports = { WishList };