const bcrypt = require('bcryptjs');

const { User } = require('../models/user.js');
const { Product } = require('../models/product.js');
const { Order } = require('../models/order.js');
const { responseObj } = require('../helpers/responseObj.js');
const { development } = require('../config/config.js');
const { Category } = require('../models/category.js');

/* @desc Create a SubAdmin */
/* @route POST /admin/subAdmin */

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

/* @desc Create a Product */
/* @route POST /admin/product */

exports.addProduct = async (req, res, next) => {
  try {

    const { title, brandName, price, description, categoryId } = req.body;
    
    if(!title || !brandName || !price || !description || !categoryId || !req.fileName ) {
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

/* @desc Edit a Product */
/* @route PUT /admin/product/:id */

exports.editProduct = async (req, res, next) => {
  try {
    const { title, brandName, price, description, categoryId } = req.body;

    if(!title || !brandName || !price || !description || !categoryId) {
      return res.status(400).json(responseObj(false, 'All details should be filled'));
    }

    const product = await Product.findByPk(req.params.id);
    product.title = title;
    product.brandName = brandName;
    product.description = description;
    product.price = price;
    product.categoryId = categoryId;
    await product.save();
    return res.status(200).json(responseObj(true, 'Product Updated'));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

/* @desc Delete a Product */
/* @route DELETE /admin/product/:id */

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    await product.destroy();
    return res.status(200).json(responseObj(true, 'Product Deleted'));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

/* @desc Get a Product by ID */
/* @route GET /admin/product/:id */

exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    return res.status(200).json(responseObj(true, `Product having ID = ${req.params.id}`, product));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

/* @desc Create a category */
/* @route POST /admin/category */

exports.addCategory = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userData.userId);
    const category = await user.createCategory({
      title: req.body.title,
      parentId: req.body.parentId || null
    });
    return res.status(200).json(responseObj(true, 'Category created.', category));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message, [error.message]));
  }
};

/* @desc Edit a category */
/* @route PUT /admin/category/:id */

exports.editCategory = async (req, res, next) => {
  try {
    const { title, parentId } = req.body;
    if(!title) {
      return res.status(400).json(responseObj(false, 'All details required'));
    }
    const category = await Category.findByPk(req.params.id);
    category.title = title;
    category.parentId = parentId || null;
    await category.save();
    return res.status(200).json(responseObj(true, 'Category updated'));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

/* @desc Delete a category */
/* @route DELETE /admin/category/:id */

exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);
    await category.destroy();
    return res.status(200).json(responseObj(true, 'Category deleted'));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

/* @desc Get category by ID */
/* @router GET /admin/category/:id */

exports.getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);
    return res.status(200).json(responseObj(true, 'Category with ID = ${req.params.id}', category));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

/* @desc Get all categories */
/* @route GET /admin/categories */

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

/* @desc Edit Admin Profile */
/* @route PUT /admin/profile */

exports.editProfile = async (req, res, next) => {
  try {
    const { name, username, email } = req.body;
    const user = await User.findByPk(req.userData.userId);
    user.name = name;
    user.username = username;
    user.email = email;
    await user.save();
    return res.status(200).json(responseObj(true, 'Profile Updated'));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

/* @desc Get all orders of all users */
/* @route GET /admin/orders */

exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      include: [{ model: User }]
    });
    return res.status(200).json(responseObj(true, "All Orders", orders));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

/* @desc Get orders by Id and its products */
/* @route GET /admin/orders/:id */

exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [{ model: Product, include: [{ model: Category, attributes: ['title'] }] }]
    });
    return res.status(200).json(responseObj(true, `Order having ID = ${req.params.id}`, order));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};