const express = require('express');
const { body, validationResult } = require('express-validator');

const authController = require('../controllers/auth.controller.js');
const { checkAuth } = require('../middlewares/checkAuth.js');
const { validateToken, validateRefreshToken } = require('../middlewares/validateToken.js');
const { signupValidator, loginValidator, validate } = require('../middlewares/validator.js');

const router = express.Router();

router.post('/signup', [ signupValidator(), validate ], authController.signup);

router.post('/login', [ loginValidator(), validate ], authController.login);

router.post('/verifyEmail', checkAuth, authController.verifyEmail);

router.post('/checkUsernameAvailable', authController.checkUsernameAvailable);

router.post('/checkEmailAvailable', authController.checkEmailAvailable);

router.get('/renewAccessToken', validateRefreshToken, authController.renewAccessToken);

router.get('/logout', validateToken, authController.logout);

module.exports = router;