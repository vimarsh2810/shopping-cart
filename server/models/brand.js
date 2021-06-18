const sequelize = require('../config/db.js');
const Sequelize = require('sequelize');

const Brand = sequelize.define('brand', 
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    }
  },
  {
    hooks: {
      beforeCreate: async function(brand, options) {
        const brandExists = await Brand.findOne({ where: { name: brand.name }});
        if(brandExists) {
          throw new Sequelize.ValidationError('Brand already exists!');
        }
      }
    }
  }
);

module.exports = { Brand };