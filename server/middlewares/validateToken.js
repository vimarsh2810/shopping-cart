const jwt = require('jsonwebtoken');
const { responseObj } = require('../helpers/responseObj');
const { development } = require('../config/config.js');

const validateToken = (req, res, next) => {
  try {
    if(!req.headers.authorization) {
      return res.status(401).json(responseObj(false, 'User not logged in.'));
    }
    console.log(req.headers);
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, development.jwt_secret);
    req.userData = decoded;
    next();
    return;
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

module.exports = { validateToken };