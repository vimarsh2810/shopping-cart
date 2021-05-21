const express = require('express');

const { validateToken } = require('../middlewares/validateToken.js');
const userController = require('../controllers/user.controller.js');

const router = express.Router();

router.get('/getUserData', validateToken, userController.getUserData);

module.exports = router;