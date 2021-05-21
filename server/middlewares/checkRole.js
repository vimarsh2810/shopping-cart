const { development } = require('../config/config.js');
const { responseObj } = require('../helpers/responseObj.js');

const checkAdmin = (req, res, next) => {
  if(req.userData.userRole == development.roles.SuperAdmin || req.userData.userRole == development.roles.SubAdmin) {
    next();
    return;
  }
  return res.status(403).json(responseObj(false, 'Not Authorized'));
};

const checkSuperAdmin = (req, res, next) => {
  if(req.userData.userRole == development.roles.SuperAdmin) {
    next();
    return;
  }
  return res.status(403).json(responseObj(false, 'Not Authorized'));
};

const checkUser = (req, res, next) => {
  if(req.userData.userRole == development.roles.User) {
    next();
    return;
  }
  return res.status(403).json(responseObj(false, 'Not Authorized'));
};

module.exports = { checkAdmin, checkSuperAdmin, checkUser };