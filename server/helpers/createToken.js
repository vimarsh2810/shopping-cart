const jwt = require('jsonwebtoken');
const { development } = require('../config/config.js');

const createToken = (userData, interval, isAccessToken) => {
  let token;
  if(isAccessToken) {
    token = jwt.sign(userData, development.jwt_secret, { expiresIn: interval });
  } else {
    token = jwt.sign(userData, development.refresh_secret, { expiresIn: interval });
  }
  
  return token;
};

module.exports = { createToken };