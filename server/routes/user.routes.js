const express = require('express');

const { validateToken } = require('../middlewares/validateToken.js');
const userController = require('../controllers/user.controller.js');
const { editProfileValidator, validate } = require('../middlewares/validator.js');

const router = express.Router();

router.get('/orders', validateToken, userController.getOrders);

router.get('/order/:id', validateToken, userController.getOrderProducts);

router.put('/order/:id/cancel', validateToken, userController.cancelOrder);

router.post('/order/:id/amount', validateToken, userController.getOrderAmount);

router.post('/order/:id/retry', validateToken, userController.retryOrder);

router.get('/notifications', validateToken, userController.getNotifications);

router.put('/profile', [validateToken, editProfileValidator(), validate ], userController.editProfile);

module.exports = router;