const express = require('express');

const { validateToken } = require('../middlewares/validateToken.js');
const userController = require('../controllers/user.controller.js');
const { editProfileValidator, validate } = require('../middlewares/validator.js');

const router = express.Router();

router.get('/getUserData', validateToken, userController.getUserData);

router.get('/orders', validateToken, userController.getOrders);

router.get('/order/:id', validateToken, userController.getOrderProducts);

router.put('/order/cancel/:id', validateToken, userController.cancelOrder);

router.post('/orderAmount/:id', validateToken, userController.getOrderAmount);

router.post('/retryOrder/:id', validateToken, userController.retryOrder);

router.get('/notifications', validateToken, userController.getNotifications);

router.put('/profile', [validateToken, editProfileValidator(), validate ], userController.editProfile);

module.exports = router;