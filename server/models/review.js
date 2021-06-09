const sequelize = require('../config/db.js');

const Sequelize = require('sequelize');
const { User } = require('./user.js');
const { Product } = require('./product.js');

const Review = sequelize.define('review', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  remark: {
    type: Sequelize.STRING
  },
  rating: {
    type: Sequelize.INTEGER,
    validate: {
      min: 1,
      max: 5
    }
  }
});

Review.belongsTo(Product, { onDelete: 'CASCADE' });
Product.hasMany(Review);

Review.belongsTo(User);
User.hasMany(Review);

module.exports = { Review };