const jwt = require('jsonwebtoken');
const { development } = require('../config/config.js');

const createToken = (userData, interval) => {
  const token = jwt.sign(userData, development.jwt_secret, { expiresIn: interval });
  return token;
};

module.exports = { createToken };