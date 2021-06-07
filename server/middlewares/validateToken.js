const jwt = require('jsonwebtoken');
const { responseObj } = require('../helpers/responseObj');
const { development } = require('../config/config.js');
const { User } = require('../models/user');

const validateToken = async (req, res, next) => {
  try {
    if(!req.headers.authorization) {
      return res.status(401).json(responseObj(false, 'User not logged in.'));
    }
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, development.jwt_secret);
    req.userData = decoded;
    const user = await User.findByPk(decoded.userId, {
      attributes: ['accessToken']
    });
    if(!user.accessToken) {
      return res.status(401).json(responseObj(false, 'User not logged in.'));
    } else if(user.accessToken !== token) {
      return res.status(401).json(responseObj(false, 'Invalid Token'));
    }
    next();
    return;
  } catch (error) {
    // return res.status(500).json(responseObj(false, error.message));
    switch(error.name) {
      case 'JsonWebTokenError':
        return res.status(401).json(responseObj(false, 'Invalid Token'));
      case 'TokenExpiredError':
        return res.status(401).json(responseObj(false, 'Token Expired'));
      case 'SyntaxError':
        return res.status(401).json(responseObj(false, 'Malformed Token'));
      default:
        return res.status(401).json(responseObj(false, error.message));
    }
  }
};

module.exports = { validateToken };