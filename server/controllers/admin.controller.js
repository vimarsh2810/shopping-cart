const bcrypt = require('bcryptjs');

const { User } = require('../models/user.js');
const { responseObj } = require('../helpers/responseObj.js');

/* =============================================
                    Sub Admins
============================================= */

exports.addSubAdmin = async (req, res, next) => {
  try {
    const user = await User.create({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 12),
      isActive: true
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
      categoryId: req.body.category
    });
    return res.status(200).json(responseObj(true, 'Product created.', product));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

/* =============================================
                    Category
============================================= */

exports.addParentCategory = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userData.userId);
    const category = await user.createCategory({
      title: req.body.title,
      parentId: 0
    });
    return res.status(200).json(responseObj(true, 'Parent Category created.', category));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

exports.addChildCategory = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userData.userId);
    const category = await user.createCategory({
      title: req.body.title,
      parentId: parentCategory
    });
    return res.status(200).json(responseObj(true, 'Child Category created.', category));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};