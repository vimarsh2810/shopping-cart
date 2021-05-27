const express = require('express');
const { body, validationResult } = require('express-validator');

const authController = require('../controllers/auth.controller.js');
const { validateToken } = require('../middlewares/validateToken.js');
const { signupValidator, loginValidator, validate } = require('../middlewares/validator.js');

const router = express.Router();

router.post('/signup', [ signupValidator(), validate ], authController.signup);

router.post('/login', [ loginValidator(), validate ], authController.login);

router.post('/verifyEmail', validateToken, authController.verifyEmail);

module.exports = router;