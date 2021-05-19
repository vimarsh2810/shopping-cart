const { Sequelize } = require('sequelize');

const { development } = require('./config.js');

const sequelize = new Sequelize(development.database, development.username, development.password, {
  dialect: development.dialect,
  host: development.host
});

module.exports = sequelize;