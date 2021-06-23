const express = require('express');

const { validateToken } = require('../middlewares/validateToken.js');
const { checkAuth } = require('../middlewares/checkAuth.js');
const cartController = require('../controllers/cart.controller.js');

const router = express.Router();

router.post('/cartFunctionalities', checkAuth, cartController.cartFunctionalities);

router.get('/products', checkAuth, cartController.getCart);

router.delete('/products/:id', validateToken, cartController.deleteCartItemSP);

router.put('/:id/quantity', validateToken, cartController.updateQuantitySP);

router.post('/verifyCoupon', checkAuth, cartController.verifyCoupon);

router.post('/paymentAmount', checkAuth, cartController.getPaymentAmount);

router.post('/payment', checkAuth, cartController.payment);

module.exports = router;