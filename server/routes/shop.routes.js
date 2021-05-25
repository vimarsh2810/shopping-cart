const express = require('express');

const { validateToken } = require('../middlewares/validateToken.js');
const shopController = require('../controllers/shop.controller.js');

const router = express.Router();

router.get('/getAllProducts', validateToken, shopController.getAllProducts);

router.get('/categories', validateToken, shopController.getCategories);

router.get('/getProductsByCategory/:categoryId', validateToken, shopController.getProductsByCategory);

module.exports = router;