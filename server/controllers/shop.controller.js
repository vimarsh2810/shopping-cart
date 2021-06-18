const { responseObj } = require('../helpers/responseObj.js');
const { Category } = require('../models/category.js');
const { Product } = require('../models/product.js');
const { pagination, paginationMetaData } = require('../helpers/pagination.js');
const { Review } = require('../models/review.js');
const { Sequelize } = require('sequelize');
const { User } = require('../models/user.js');
const { Brand } = require('../models/brand.js');

const Op = require('sequelize').Op;

// @desc Get all products
// @route GET /shop/getAllProducts

exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll();
    return res.status(200).json(responseObj(false, 'All products', products));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

// @desc Get limited products
// @route GET /shop/limitedProducts

exports.getProducts = async (req, res, next) => {
  try {

    let { page, limit, includeCategory } = req.query;
    const { offset, size } = pagination(page, limit);
    let items;
    if(includeCategory) {
      items = await Product.findAndCountAll({
        include: [ 
          { model: Category, attributes: ['title'] },
          { model: Review } 
        ],
        limit: size,
        offset: offset
      });
    } else {
      items = await Product.findAndCountAll({ limit: size, offset: offset });
    }

    items.rows.forEach((item) => {
      let sumRating = 0;
      item.reviews.forEach((review) => {
        sumRating += parseInt(review.rating);
      });
      item.dataValues.avgRating = item.reviews.length > 0 ? Number(sumRating / item.reviews.length).toFixed(1) : null;
    });
    
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
    const product = await Product.findByPk(req.params.id, {
      attributes: [
        'id', 'title', 
        'price', 'description', 
        'categoryId', 'imagePath', 
        [Sequelize.fn('avg', Sequelize.col('reviews.rating')), 'avgRating']
      ],
      include: [
        { 
          model: Category
        },
        {
          model: Brand
        },
        {
          model: Review,
          attributes: []
        }
      ]
    });

    product.dataValues.reviews = await product.getReviews({
      include: [{ model: User, attributes: ['id', 'username'] }]
    });
    return res.status(200).json(responseObj(true, `Product with ID = ${req.params.id}`, product));
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

    const category = await Category.findByPk(req.params.id, {
      attributes: ['title']
    });

    const items = await Product.findAndCountAll({ 
      where: { categoryId: req.params.id }, 
      limit: size, offset: offset 
    });
    
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

exports.searchProduct = async (req, res, next) => {
  try {
    const { page, limit, searchText } = req.query;
    const { offset, size } = pagination(page, limit);

    const items = await Product.findAndCountAll({
      where: {
        title: {
          [Op.like]: `%${searchText.toLowerCase()}%`
        }
      },
      limit: size,
      offset: offset
    });

    const result = paginationMetaData(items, page, size);
    return res.status(200).json(responseObj(true, 'Paginated Products by category', {
      productCount: result.count,
      products: result.rows,
      totalPages: result.totalNoOfPages,
      currentPage: result.currentPage
    }));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

/* @desc GET Get a brand by ID */
/* @route GET /admin/brand/:id */

exports.getBrandByID = async (req, res, next) => {
  try {
    const brand = await Brand.findByPk(req.params.id);
    return res.status(200).json(responseObj(true, 'Brand Deleted', brand));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

/* @desc GET Get all brands */
/* @route GET /shop/brands */

exports.getAllBrands = async (req, res, next) => {
  try {
    const brands = await Brand.findAll();
    return res.status(200).json(responseObj(true, 'Brand Deleted', brands));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

/* @desc GET Get filtered products */
/* @route GET /shop/filteredProducts */

exports.filterProducts = async (req, res, next) => {
  try {
    const { brandId, minPrice, maxPrice, page, limit  } = req.query;
    const { offset, size } = pagination(page, limit);
    let items;
    if(!brandId) {
      items = await Product.findAndCountAll({
        where: {
          price: {
            [Op.between]: [parseFloat(minPrice), parseFloat(maxPrice)]
          }
        },
  
        limit: size,
        offset: offset
      });
    } else {
      items = await Product.findAndCountAll({
        where: { 
          brandId: brandId,
          price: {
            [Op.between]: [parseFloat(minPrice), parseFloat(maxPrice)]
          }
        },
  
        limit: size,
        offset: offset
      });
    }

    const result = paginationMetaData(items, page, size);
    
    return res.status(200).json(responseObj(true, 'Filtered Paginated Products', {
      productCount: result.count,
      products: result.rows,
      totalPages: result.totalNoOfPages,
      currentPage: result.currentPage
    }));

  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

/* @desc GET Get filtered products with category */
/* @route GET /shop/filteredProductsCategory */

exports.filterProductsCategory = async (req, res, next) => {
  try {
    const { brandId, minPrice, maxPrice, page, limit, categoryId  } = req.query;
    const { offset, size } = pagination(page, limit);
    let items;
    if(!brandId) {
      items = await Product.findAndCountAll({
        where: {
          categoryId: categoryId,
          price: {
            [Op.between]: [parseFloat(minPrice), parseFloat(maxPrice)]
          }
        },
  
        limit: size,
        offset: offset
      });
    } else {
      items = await Product.findAndCountAll({
        where: {
          categoryId: categoryId,
          brandId: brandId,
          price: {
            [Op.between]: [parseFloat(minPrice), parseFloat(maxPrice)]
          }
        },
  
        limit: size,
        offset: offset
      });
    }

    const result = paginationMetaData(items, page, size);
    
    return res.status(200).json(responseObj(true, 'Filtered Paginated Products', {
      productCount: result.count,
      products: result.rows,
      totalPages: result.totalNoOfPages,
      currentPage: result.currentPage
    }));

  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};