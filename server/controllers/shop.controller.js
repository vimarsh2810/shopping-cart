const { responseObj } = require('../helpers/responseObj.js');
const { Category } = require('../models/category.js');
const { Product } = require('../models/product.js');
const { pagination, paginationMetaData } = require('../helpers/pagination.js');
const { Review } = require('../models/review.js');
const { Sequelize } = require('sequelize');
const { User } = require('../models/user.js');
const { Brand } = require('../models/brand.js');

const Op = require('sequelize').Op;
const { ProductImage } = require('../models/productImage.js');

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

    let products;
    if(includeCategory) {
      products = await Product.findAll({
        include: [ 
          { model: Category, attributes: ['title'] },
          { model: Review },
          { model: ProductImage, attributes: ['id', 'path'] }
        ],
        limit: size,
        offset: offset,
        order: [[{ model: ProductImage }, 'id', 'ASC']]
      });
    } else {
      products = await Product.findAll({ 
        limit: size,
        offset: offset,
        include: [{ model: ProductImage, attributes: ['id', 'path'] }],
        order: [[{ model: ProductImage }, 'id', 'ASC']]
      });
    }
    const count = await Product.count();

    products.forEach((product) => {
      let sumRating = 0;
      product.reviews.forEach((review) => {
        sumRating += parseInt(review.rating);
      });
      product.dataValues.avgRating = product.reviews.length > 0 ? Number(sumRating / product.reviews.length).toFixed(1) : null;
    });
    
    const result = paginationMetaData(products, count, page, size);
    
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
        'categoryId', 
        [Sequelize.fn('avg', Sequelize.col('reviews.rating')), 'avgRating']
      ],
      include: [
        { model: Category },
        { model: Brand },
        { model: Review, attributes: [] }
      ]
    });

    product.dataValues.productImages = await product.getProductImages({
      attributes: ['id', 'path'],
      order: [['id', 'ASC']]
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
// @route GET /shop/productsByCategory/:categoryId

exports.getProductsByCategory = async (req, res, next) => {
  try {
    let { page, limit } = req.query;
    const { offset, size } = pagination(page, limit); 

    const category = await Category.findByPk(req.params.id, {
      attributes: ['title']
    });
    
    const items = await Product.findAll({ 
      where: { categoryId: req.params.id },
      include: [
        { model: Review },
        { model: ProductImage, attributes: ['id', 'path'] }
      ],
      limit: size, 
      offset: offset,
      order: [[{ model: ProductImage }, 'id', 'ASC']]
    });

    const count = await Product.count({
      where: { categoryId: req.params.id }
    });

    items.forEach((item) => {
      let sumRating = 0;
      item.reviews.forEach((review) => {
        sumRating += parseInt(review.rating);
      });
      item.dataValues.avgRating = item.reviews.length > 0 ? Number(sumRating / item.reviews.length).toFixed(1) : null;
    });
    
    const result = paginationMetaData(items, count, page, size);
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
    const { page, limit, searchText, categoryId } = req.query;
    const { offset, size } = pagination(page, limit);

    let items;
    let count;

    if(!categoryId) {
      items = await Product.findAll({
        where: {
          title: {
            [Op.like]: `%${searchText.toLowerCase()}%`
          }
        },
        include: [
          { model: Review },
          { model: ProductImage, attributes: ['id', 'path'] }
        ],
        limit: size,
        offset: offset,
        order: [[{ model: ProductImage }, 'id', 'ASC']]
      });

      count = await Product.count({
        where: {
          title: {
            [Op.like]: `%${searchText.toLowerCase()}%`
          }
        }
      });
    } else {
      items = await Product.findAll({
        where: {
          categoryId: categoryId,
          title: {
            [Op.like]: `%${searchText.toLowerCase()}%`
          }
        },
        include: [
          { model: Review },
          { model: ProductImage, attributes: ['id', 'path'] }
        ],
        limit: size,
        offset: offset,
        order: [[{ model: ProductImage }, 'id', 'ASC']]
      });

      count = await Product.count({
        where: {
          categoryId: categoryId,
          title: {
            [Op.like]: `%${searchText.toLowerCase()}%`
          }
        }
      });
    }

    items.forEach((item) => {
      let sumRating = 0;
      item.reviews.forEach((review) => {
        sumRating += parseInt(review.rating);
      });
      item.dataValues.avgRating = item.reviews.length > 0 ? Number(sumRating / item.reviews.length).toFixed(1) : null;
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

    let filteredProducts;
    let count;

    if(!brandId) {
      filteredProducts = await Product.findAll({
        where: {
          price: {
            [Op.between]: [parseFloat(minPrice), parseFloat(maxPrice)]
          }
        },
        include: [
          { model: Review },
          { model: ProductImage, attributes: ['id', 'path'] }
        ],
        limit: size,
        offset: offset,
        order: [[{ model: ProductImage }, 'id', 'ASC']]
      });

      count = await Product.count({
        where: {
          price: {
            [Op.between]: [parseFloat(minPrice), parseFloat(maxPrice)]
          }
        }
      });
    } else {
      filteredProducts = await Product.findAll({
        where: { 
          brandId: brandId,
          price: {
            [Op.between]: [parseFloat(minPrice), parseFloat(maxPrice)]
          }
        },
        include: [
          { model: Review },
          { model: ProductImage, attributes: ['id', 'path'] }
        ],
        limit: size,
        offset: offset,
        order: [[{ model: ProductImage }, 'id', 'ASC']]
      });

      count = await Product.count({
        where: {
          brandId: brandId,
          price: {
            [Op.between]: [parseFloat(minPrice), parseFloat(maxPrice)]
          }
        }
      });
    }
    
    filteredProducts.forEach((product) => {
      let sumRating = 0;
      product.reviews.forEach((review) => {
        sumRating += parseInt(review.rating);
      });
      product.dataValues.avgRating = product.reviews.length > 0 ? Number(sumRating / product.reviews.length).toFixed(1) : null;
    });

    const result = paginationMetaData(filteredProducts, count, page, size);
    
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
    let count;
    if(!brandId) {
      items = await Product.findAll({
        where: {
          categoryId: categoryId,
          price: {
            [Op.between]: [parseFloat(minPrice), parseFloat(maxPrice)]
          }
        },
        include: [
          { model: Review },
          { model: ProductImage, attributes: ['id', 'path'] }
        ], 
        limit: size,
        offset: offset,
        order: [[{ model: ProductImage }, 'id', 'ASC']]
      });

      count = await Product.count({ 
        where: {
          categoryId: categoryId,
          price: {
            [Op.between]: [parseFloat(minPrice), parseFloat(maxPrice)]
          }
        } 
      });
    } else {
      items = await Product.findAll({
        where: {
          categoryId: categoryId,
          brandId: brandId,
          price: {
            [Op.between]: [parseFloat(minPrice), parseFloat(maxPrice)]
          }
        },
        include: [
          { model: Review },
          { model: ProductImage, attributes: ['id', 'path'] }
        ],
        limit: size,
        offset: offset,
        order: [[{ model: ProductImage }, 'id', 'ASC']]
      });

      count = await Product.count({ 
        where: {
          categoryId: categoryId,
          brandId: brandId,
          price: {
            [Op.between]: [parseFloat(minPrice), parseFloat(maxPrice)]
          }
        } 
      });
    }

    items.forEach((item) => {
      let sumRating = 0;
      item.reviews.forEach((review) => {
        sumRating += parseInt(review.rating);
      });
      item.dataValues.avgRating = item.reviews.length > 0 ? Number(sumRating / item.reviews.length).toFixed(1) : null;
    });

    const result = paginationMetaData(items, count, page, size);
    
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