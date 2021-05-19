const sequelize = require('../config/db.js');
const Sequelize = require('sequelize');

const UserRole = sequelize.define('userRole', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    roleName: {
      type: Sequelize.STRING(15),
      allowNull: false,
      unique: true
    }
  },
  {
    timestamps: false
  }
);

module.exports = { UserRole };