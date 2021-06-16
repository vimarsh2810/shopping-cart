const express = require('express');

const { validateToken } = require('../middlewares/validateToken.js');
const shopController = require('../controllers/shop.controller.js');

const router = express.Router();

router.get('/products', validateToken, shopController.getAllProducts);

router.get('/searchedProducts', validateToken, shopController.searchProduct);

router.get('/products/:id', shopController.getProductById);

router.get('/limitedProducts', shopController.getProducts);

router.get('/categories', shopController.getCategories);

router.get('/productsByCategory/:id', shopController.getProductsByCategory);

module.exports = router;