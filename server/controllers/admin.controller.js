const bcrypt = require('bcryptjs');

const { User } = require('../models/user.js');
const { responseObj } = require('../helpers/responseObj.js');
const { development } = require('../config/config.js');

/* =============================================
                    Sub Admins
============================================= */

exports.addSubAdmin = async (req, res, next) => {
  try {
    const user = await User.create({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, parseInt(development.salt_value)),
      isActive: true,
      userRoleId: development.roles.SubAdmin
    });

    return res.status(200).json(responseObj(true, 'Sub Admin Created.'));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

/* =============================================
                    Products
============================================= */

exports.addProduct = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userData.userId);
    const product = await user.createProduct({
      title: req.body.title,
      price: req.body.price,
      description: req.body.description,
      categoryId: req.body.categoryId
    });
    return res.status(200).json(responseObj(true, 'Product created.', product));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

/* =============================================
                    Category
============================================= */

exports.addCategory = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userData.userId);
    const category = await user.createCategory({
      title: req.body.title,
      parentId: req.body.parentId || null
    });
    return res.status(200).json(responseObj(true, 'Category created.', category));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};