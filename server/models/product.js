const Sequelize = require('sequelize');

const sequelize = require('../config/db.js');
const { Brand } = require('./brand.js');
const { Category } = require('./category.js');
const { User } = require('./user.js');

const Product = sequelize.define('product', 
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    title: {
      type: Sequelize.STRING(40),
      unique: true,
      allowNull: false
    },
    description: {
      type: Sequelize.STRING
    },
    price: {
      type: Sequelize.DECIMAL
    },
    imagePath: {
      type: Sequelize.STRING
    }
  },
  {
    hooks: {
      beforeCreate: async function(product, options) {
        const productExist = await Product.findOne({ where: { title: product.title } });
        if(productExist) {
          throw new Sequelize.ValidationError('Product already exists!');
        }
      }
    }
  }
);

Product.belongsTo(User);
User.hasMany(Product);

Product.belongsTo(Category, { onDelete: 'CASCADE'});
Category.hasMany(Product);

Product.belongsTo(Brand, { onDelete: 'CASCADE' });
Brand.hasMany(Product);

module.exports = { Product };