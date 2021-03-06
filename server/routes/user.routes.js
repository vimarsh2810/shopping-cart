const express = require('express');

const { validateToken } = require('../middlewares/validateToken.js');
const { checkUser } = require('../middlewares/checkRole.js');
const userController = require('../controllers/user.controller.js');
const { editProfileValidator, validate } = require('../middlewares/validator.js');
const { checkAuth } = require('../middlewares/checkAuth.js');

const router = express.Router();

router.get('/data', validateToken, userController.getUserData);

router.get('/wallet/balance', [validateToken, checkUser], userController.getWalletBalance);

router.put('/wallet/balance', [checkAuth, checkUser], userController.addAmountInWallet);

router.get('/orders', [checkAuth, checkUser], userController.getOrders);

router.get('/order/:id', [checkAuth, checkUser], userController.getOrderProducts);

router.put('/order/:id/cancel', [checkAuth, checkUser], userController.cancelOrder);

router.post('/order/:id/amount', [checkAuth, checkUser], userController.getOrderAmount);

router.post('/order/:id/retry', [checkAuth, checkUser], userController.retryOrder);

router.post('/order/:id/invoice', [checkAuth, checkUser], userController.generateInvoice);

router.get('/order/:id/invoice', [validateToken, checkUser], userController.getOrderInvoice);

router.get('/notifications', [validateToken, checkUser], userController.getNotifications);

router.put('/profile', [checkAuth, checkUser, editProfileValidator(), validate ], userController.editProfile);

router.get('/wishList', [checkAuth, checkUser], userController.getWishList);

router.post('/wishList/:id', [checkAuth, checkUser], userController.addToWishList);

router.delete('/wishList/:id', [checkAuth, checkUser], userController.removeFromWishList);

router.post('/review/:productId', [checkAuth, checkUser], userController.giveProductReview);

router.get('/getOrder/:productId', validateToken, userController.getOrderItem);

module.exports = router;