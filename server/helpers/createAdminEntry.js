const { development } = require('../config/config.js');
const { User } = require('../models/user.js');
const { UserRole } = require('../models/userRole.js');

const bcrypt = require('bcryptjs');

const createAdminEntry = async () => {
  const roles = [
    { roleName: 'super admin' },
    { roleName: 'sub admin' },
    { roleName: 'user' }
  ];
  await UserRole.bulkCreate(roles);
  await User.create({
    name: development.admin_name,
    username: development.admin_username,
    email: development.admin_email,
    isActive: true,
    password: bcrypt.hashSync(development.admin_pw, parseInt(development.salt_value)),
    verificationOtp: null,
    userRoleId: development.roles.SuperAdmin
  });
};

module.exports = { createAdminEntry };