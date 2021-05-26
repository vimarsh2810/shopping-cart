const express = require('express');

const authController = require('../controllers/auth.controller.js');
const { validateToken } = require('../middlewares/validateToken.js');

const router = express.Router();

router.post('/signup', authController.signup);

router.post('/login', authController.login);

router.post('/verifyEmail', validateToken, authController.verifyEmail);

module.exports = router;