const bcrypt = require('bcryptjs');

const { User } = require('../models/user.js');
const { responseObj } = require('../helpers/responseObj.js');
const { development } = require('../config/config.js');
const { Category } = require('../models/category.js');

// @desc Create a SubAdmin
// @route POST /admin/subAdmin/add 

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

// @desc Create a Product
// @route POST /admin/product/add 

exports.addProduct = async (req, res, next) => {
  try {

    const { title, price, description, categoryId, userId } = req.body;
    
    if(!title || !price || !description || !categoryId || !userId || !req.fileName) {
      return res.status(400).json(responseObj(false, 'All details should be filled'));
    }

    const user = await User.findByPk(req.userData.userId);
    const product = await user.createProduct({
      title: req.body.title,
      price: req.body.price,
      brandName: req.body.brandName,
      description: req.body.description,
      categoryId: req.body.categoryId,
      imagePath: `/img/products/${req.fileName}`
    });

    return res.status(200).json(responseObj(true, 'Product created.', product));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

// @desc Create a SubAdmin
// @route POST /admin/category/add 

exports.addCategory = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userData.userId);
    const category = await user.createCategory({
      title: req.body.title,
      parentId: req.body.parentId || null
    });
    return res.status(200).json(responseObj(true, 'Category created.', category));
  } catch (error) {
    console.log(error)
    return res.status(500).json(responseObj(false, error.message, [error.message]));
  }
};

// @desc Get all categories
// @route GET /admin/categories

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll({ where: { parentId: null } });
    for(let category of categories) {
      category.dataValues.children = await category.getChildren();
    }
    return res.status(200).json(responseObj(true, 'Categories', categories));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};