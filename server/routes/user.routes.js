const express = require('express');

const { validateToken } = require('../middlewares/validateToken.js');
const userController = require('../controllers/user.controller.js');
const { editProfileValidator, validate } = require('../middlewares/validator.js');

const router = express.Router();

router.get('/data', validateToken, userController.getUserData);

router.get('/walletBalance', validateToken, userController.getWalletBalance);

router.get('/orders', validateToken, userController.getOrders);

router.get('/order/:id', validateToken, userController.getOrderProducts);

router.put('/order/:id/cancel', validateToken, userController.cancelOrder);

router.post('/order/:id/amount', validateToken, userController.getOrderAmount);

router.post('/order/:id/retry', validateToken, userController.retryOrder);

router.get('/notifications', validateToken, userController.getNotifications);

router.put('/profile', [validateToken, editProfileValidator(), validate ], userController.editProfile);

router.get('/wishList', validateToken, userController.getWishList);

router.post('/wishList/:id', validateToken, userController.addToWishList);

router.delete('/wishList/:id', validateToken, userController.removeFromWishList);

module.exports = router;