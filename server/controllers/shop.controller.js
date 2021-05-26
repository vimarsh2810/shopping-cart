const { responseObj } = require('../helpers/responseObj.js');
const { Category } = require('../models/category.js');
const { Product } = require('../models/product.js');
const Op = require('sequelize').Op;

// @desc Get all products
// @route GET /shop/getAllProducts

exports.getAllProducts = async (req, res, next) => {
  try {
    console.log('shop')
    const products = await Product.findAll();
    return res.status(200).json(responseObj(false, 'All products', products));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

// @desc Get product by id
// @route GET /shop/product/:id

exports.getProductById = async (req, res, next) => {
  try {
    const products = await Product.findByPk(req.params.id);
    return res.status(200).json(responseObj(false, 'All products', products));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

// @desc Get all categories
// @route GET /shop/categories

exports.getCategories = async (req, res, next) => {
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

// @desc Get products by categoryId
// @route GET /shop/getProductsByCategory/:categoryId

exports.getProductsByCategory = async (req, res, next) => {
  try {
    const category = await Category.findOne({ where: { id: parseInt(req.params.categoryId) }, include: [{ model: Product}] });
    return res.status(200).json(responseObj(true, 'Products by category', category));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};