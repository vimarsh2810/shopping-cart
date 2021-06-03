const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
require('dotenv').config();

const { createToken } = require('../helpers/createToken.js');
const { deliverMail } = require('../helpers/nodeMailer.js');
const { responseObj } = require('../helpers/responseObj.js');
const { User } = require('../models/user.js');
const { generateOtp } = require('../helpers/generateOtp.js');
const { development } = require('../config/config.js');

const tokenExpirationTime = 60*60;

// @desc User Signup
// @route POST /auth/signup 

exports.signup = async (req, res, next) => {
  try {
    const otp = generateOtp();

    const user = await User.create({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, parseInt(development.salt_value)),
      verificationOtp: otp,
      userRoleId: development.roles.User
    });

    await user.createCart();
    await user.createWishList();
    const wallet = await user.createWallet();
    
    deliverMail(
      { 
        email: user.email, 
        otp: user.verificationOtp 
      },
      'Email Verification',
      `Verify your emailId using this OTP: `
    );
    
    return res.status(200).json(responseObj(true, `Registration Successful, check your email for verification`));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message, [error.message]));
  }
};

// @desc Verify user emailId
// @route GET /verifyEmail/:userId/:token

exports.verifyEmail = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userData.userId);
    if(user.verificationOtp !== req.body.otp) {
      return res.status(400).json(responseObj(false, 'Incorrect Otp'));
    }
    user.isActive = true;
    await user.save();
    const wallet = await user.getWallet();
    wallet.balance = development.initial_balance;
    await wallet.save();
    const coupon = await user.createCoupon({
      code: 'WELCOME' + user.username.toUpperCase()
    });
    return res.status(200).json(responseObj(true, 'Email Verified'));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

// @desc Login
// @route POST /auth/login

exports.login = async (req, res, next) => {
  try {
    
    const user = await User.findOne({ where: { email: req.body.email } });
    if(!user) {
      return res.status(404).json(responseObj(false, 'Email is not registered!'));
    }

    const passwordCompare = bcrypt.compareSync(req.body.password, user.password);
    if(!passwordCompare) {
      return res.status(401).json(responseObj(false, 'Invalid Credentails'));
    }
    
    const token = createToken({
      userId: user.id,
      userName: user.username,
      userRole: user.userRoleId
    }, tokenExpirationTime);
    
    return res.status(200).json(responseObj(true, 'Login Successful!', {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      roleId: user.userRoleId,
      isActive: user.isActive,
      tokenExpirationTime: tokenExpirationTime
    }, token));
    
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};