const sequelize = require('../config/db.js');
const Sequelize = require('sequelize');

const Brand = sequelize.define('brand', {
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
  }
);

module.exports = { Brand };