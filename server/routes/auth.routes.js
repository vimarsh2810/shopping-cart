const express = require('express');

const authController = require('../controllers/auth.controller.js');

const router = express.Router();

router.post('/signup', authController.signup);

router.post('/login', authController.login);

router.get('/verifyEmail/:userId/:token', authController.verifyEmail);

module.exports = router;