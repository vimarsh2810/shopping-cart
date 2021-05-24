const { responseObj } = require('../helpers/responseObj.js');
const { Product } = require('../models/product.js');

exports.getAllProducts = async (req, res, next) => {
  try {
    console.log('shop')
    const products = await Product.findAll();
    return res.status(200).json(responseObj(false, 'All products', products));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const products = await Product.findByPk(req.params.id);
    return res.status(200).json(responseObj(false, 'All products', products));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};