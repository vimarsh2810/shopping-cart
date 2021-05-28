const express = require('express');

const { validateToken } = require('../middlewares/validateToken.js');
const shopController = require('../controllers/shop.controller.js');

const router = express.Router();

router.get('/products', validateToken, shopController.getAllProducts);

router.get('/limitedProducts', shopController.getProducts);

router.get('/categories', validateToken, shopController.getCategories);

router.get('/productsByCategory/:categoryId', validateToken, shopController.getProductsByCategory);

module.exports = router;