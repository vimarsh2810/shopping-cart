const express = require('express');

const { validateToken } = require('../middlewares/validateToken.js');
const userController = require('../controllers/user.controller.js');

const router = express.Router();

router.get('/getUserData', validateToken, userController.getUserData);

router.get('/orders', validateToken, userController.getOrders);

router.get('/order/:id', validateToken, userController.getOrderProducts);

router.post('/orderAmount/:id', validateToken, userController.getOrderAmount);

router.post('/retryOrder/:id', validateToken, userController.retryOrder);

router.get('/notification', validateToken, userController.getNotifications);

module.exports = router;