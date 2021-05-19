const sequelize = require('../config/db.js');
const Sequelize = require('sequelize');
const { UserRole } = require('./userRole.js');

const User = sequelize.define('user', {
    id:{
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING(40),
      allowNull: false
    },
    username: {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        is: ["^[a-z][a-z0-9]{4,20}", "i"]
      }
    },
    email: {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique: true
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    activationToken: {
      type: Sequelize.STRING
    },
    isActive: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    accessToken: {
      type: Sequelize.STRING
    }
  },
  {
    hooks: {
      beforeCreate: async function(user, options) {
        const reqUser = await User.findOne({ where: { email: user.email } });
        if(reqUser) {
          throw new Error('Email already exists!');
        }
      }
    }
  }
);

User.belongsTo(UserRole);
UserRole.hasMany(User);

module.exports = { User };