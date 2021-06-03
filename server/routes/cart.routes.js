const express = require('express');

const { validateToken } = require('../middlewares/validateToken.js');
const cartController = require('../controllers/cart.controller.js');

const router = express.Router();

router.post('/addToCart', validateToken, cartController.addToCart);

router.get('/cartProducts', validateToken, cartController.getCart);

router.delete('/cartProduct/:productId', validateToken, cartController.deleteCartItemSP);

router.put('/quantity/:productId', validateToken, cartController.updateQuantity);

router.post('/verifyCoupon', validateToken, cartController.verifyCoupon);

router.post('/paymentAmount', validateToken, cartController.getPaymentAmount);

router.post('/payment', validateToken, cartController.payment);

module.exports = router;