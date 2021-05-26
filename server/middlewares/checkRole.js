const { development } = require('../config/config.js');
const { responseObj } = require('../helpers/responseObj.js');

// Checking if the user is Admin
const checkAdmin = (req, res, next) => {
  if(req.userData.userRole == development.roles.SuperAdmin || req.userData.userRole == development.roles.SubAdmin) {
    next();
    return;
  }
  return res.status(403).json(responseObj(false, 'Not Authorized'));
};

// Checking if the user is SuperAdmin
const checkSuperAdmin = (req, res, next) => {
  if(req.userData.userRole == development.roles.SuperAdmin) {
    next();
    return;
  }
  return res.status(403).json(responseObj(false, 'Not Authorized'));
};

// Checking if the user is Normal User
const checkUser = (req, res, next) => {
  if(req.userData.userRole == development.roles.User) {
    next();
    return;
  }
  return res.status(403).json(responseObj(false, 'Not Authorized'));
};

module.exports = { checkAdmin, checkSuperAdmin, checkUser };