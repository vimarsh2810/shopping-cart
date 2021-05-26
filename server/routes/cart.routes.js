const express = require('express');

const { validateToken } = require('../middlewares/validateToken.js');
const cartController = require('../controllers/cart.controller.js');

const router = express.Router();

router.post('/addToCart', validateToken, cartController.addToCart);

router.get('/getCart', validateToken, cartController.getCart);

router.delete('/deleteCartItem/:productId', validateToken, cartController.deleteCartItem);

router.put('/updateQuantity/:productId', validateToken, cartController.updateQuantity);

router.post('/verifyCoupon', validateToken, cartController.verifyCoupon);

module.exports = router;