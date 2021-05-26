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
      type: Sequelize.STRING(20),
      allowNull: false,
      unique: true
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
    verificationOtp: {
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
        const userExist = await User.findOne({ 
          where: { 
            [Sequelize.Op.or]: {
              email: user.email, 
              username: user.username
            }
          } 
        });
        if(userExist) {
          throw new Sequelize.ValidationError("Email or Username is already registered");
        }
      }
    }
  }
);

User.belongsTo(UserRole);
UserRole.hasMany(User);

module.exports = { User };