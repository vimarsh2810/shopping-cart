const { responseObj } = require('../helpers/responseObj.js');
const { Category } = require('../models/category.js');
const { Product } = require('../models/product.js');
const { pagination, paginationMetaData } = require('../helpers/pagination.js');
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

// @desc Get all products
// @route GET /shop/getAllProducts

exports.getProducts = async (req, res, next) => {
  try {

    let { page, limit } = req.query;
    const { offset, size } = pagination(page, limit); 

    const items = await Product.findAndCountAll({ limit: size, offset: offset });
    const result = paginationMetaData(items, page, size);
    return res.status(200).json(responseObj(true, 'Paginated Products', {
      productCount: result.count,
      products: result.rows,
      totalPages: result.totalNoOfPages,
      currentPage: result.currentPage
    }));
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
    let { page, limit } = req.query;
    const { offset, size } = pagination(page, limit); 

    const category = await Category.findByPk(req.params.categoryId, {
      attributes: ['title']
    });
    const items = await Product.findAndCountAll({ where: { categoryId: req.params.categoryId }, limit: size, offset: offset });
    const result = paginationMetaData(items, page, size);
    return res.status(200).json(responseObj(true, 'Paginated Products by category', {
      productCount: result.count,
      products: result.rows,
      categoryTitle: category.title,
      totalPages: result.totalNoOfPages,
      currentPage: result.currentPage
    }));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};