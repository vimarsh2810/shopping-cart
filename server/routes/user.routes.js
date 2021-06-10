const express = require('express');

const { validateToken } = require('../middlewares/validateToken.js');
const { checkUser } = require('../middlewares/checkRole.js');
const userController = require('../controllers/user.controller.js');
const { editProfileValidator, validate } = require('../middlewares/validator.js');

const router = express.Router();

router.get('/data', validateToken, userController.getUserData);

router.get('/wallet/balance', [validateToken, checkUser], userController.getWalletBalance);

router.put('/wallet/balance', [validateToken, checkUser], userController.addAmountInWallet);

router.get('/orders', [validateToken, checkUser], userController.getOrders);

router.get('/order/:id', [validateToken, checkUser], userController.getOrderProducts);

router.put('/order/:id/cancel', [validateToken, checkUser], userController.cancelOrder);

router.post('/order/:id/amount', [validateToken, checkUser], userController.getOrderAmount);

router.post('/order/:id/retry', [validateToken, checkUser], userController.retryOrder);

router.post('/order/:id/invoice', [validateToken, checkUser], userController.generateInvoice);

router.get('/order/:id/invoice', [validateToken, checkUser], userController.getOrderInvoice);

router.get('/notifications', [validateToken, checkUser], userController.getNotifications);

router.put('/profile', [validateToken, checkUser, editProfileValidator(), validate ], userController.editProfile);

router.get('/wishList', [validateToken, checkUser], userController.getWishList);

router.post('/wishList/:id', [validateToken, checkUser], userController.addToWishList);

router.delete('/wishList/:id', [validateToken, checkUser], userController.removeFromWishList);

router.post('/review/:productId', [validateToken, checkUser], userController.giveProductReview);

router.get('/getOrder/:productId', validateToken, userController.getOrderItem);
module.exports = router;