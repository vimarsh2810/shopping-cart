const Sequelize = require('sequelize');

const sequelize = require('../config/db.js');
const { User } = require('./user.js');

const Category = sequelize.define('category', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    title: {
      type: Sequelize.STRING(40),
      unique: true
    }
  },
  {
    hooks: {
      beforeCreate: async function(category, options) {
        const categoryExist = await Category.findOne({ where: { title: category.title } });
        if(categoryExist) {
          throw new Sequelize.ValidationError("Category already exists");
        }
      }
    }
  }
);

Category.hasMany(Category, { as: 'children', foreignKey: 'parentId' });
Category.belongsTo(Category, { as: 'parent', foreignKey: 'parentId', onDelete: 'CASCADE' });

Category.belongsTo(User);
User.hasMany(Category);

module.exports = { Category };