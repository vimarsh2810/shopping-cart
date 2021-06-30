const bcrypt = require('bcryptjs');
require('dotenv').config();

const { createToken } = require('../helpers/createToken.js');
const { deliverMail } = require('../helpers/nodeMailer.js');
const { responseObj } = require('../helpers/responseObj.js');
const { User } = require('../models/user.js');
const { generateOtp } = require('../helpers/generateOtp.js');
const { development } = require('../config/config.js');

const accessTokenExpirationTime = development.accessTokenExpirationTime;
const refreshTokenExpirationTime = development.refreshTokenExpirationTime;

const verifyOldPassword = async (userId, enteredPassword) => {
  try {
    const user = await User.findByPk(userId, {
      attributes: ['id', 'password']
    });

    const passwordCompare = bcrypt.compareSync(enteredPassword, user.password);
    if(!passwordCompare) {
      return false
    }
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};

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
    deliverMail(
      { 
        email: user.email, 
        otp: coupon.code 
      },
      'Your Personalized Coupon',
      `Use this coupon code get 50% off on your 1st order: `
    );
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
    
    const accessToken = createToken({
      userId: user.id,
      userName: user.username,
      userRole: user.userRoleId
    }, accessTokenExpirationTime, true);

    const refreshToken = createToken({
      userId: user.id,
      userName: user.username,
      userRole: user.userRoleId
    }, refreshTokenExpirationTime, false);

    user.accessToken = accessToken;
    user.refreshToken = refreshToken;
    await user.save();
    
    return res.status(200).json(responseObj(true, 'Login Successful!', {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      roleId: user.userRoleId,
      isActive: user.isActive
    }, accessToken, refreshToken));
    
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

// @desc Check Email available
// @route POST /auth/checkEmailAvailable

exports.checkEmailAvailable = async (req, res, next) => {
  try {
    const { email } = req.body;
    const emailExists = await User.findOne({ where: { email: email } });
    if(emailExists) {
      return res.status(200).json(responseObj(false, 'Email not available'));
    }
    return res.status(200).json(responseObj(true, 'Email available'));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

// @desc Check Username available
// @route POST /auth/checkUsernameAvailable

exports.checkUsernameAvailable = async (req, res, next) => {
  try {
    const { username } = req.body;
    const usernameExists = await User.findOne({ where: { username: username } });
    if(usernameExists) {
      return res.status(200).json(responseObj(false, 'Username not available'));
    }
    return res.status(200).json(responseObj(true, 'Username available'));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

exports.renewAccessToken = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userData.userId);

    const accessToken = createToken({
      userId: user.id,
      userName: user.username,
      userRole: user.userRoleId
    }, accessTokenExpirationTime, true);

    user.accessToken = accessToken;
    await user.save();
    return res.status(200).json(responseObj(true, 'Access Token', null, accessToken));
  } catch (error) {
    console.log(error)
    return res.status(500).json(responseObj(false, error.message));
  }
};

exports.logout = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userData.userId);
    user.accessToken = null;
    user.refreshToken = null;
    await user.save();
    return res.status(200).json(responseObj(true, 'User Logged Out'));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

// @desc verify old password
// @route POST /auth/checkOldPassword

exports.checkOldPassword = async (req, res, next) => {
  try {
    const { oldPassword } = req.body;

    const user = await User.findByPk(req.userData.userId, {
      attributes: ['id', 'password']
    });

    const isPasswordCorrect = bcrypt.compareSync(oldPassword, user.password);

    if(!isPasswordCorrect) {
      return res.status(400).json(responseObj(false, 'Incorrect Password'));
    }
    return res.status(200).json(responseObj(true, 'Correct Password'));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

// @desc change password
// @route PUT /auth/password

exports.changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if(!oldPassword || !newPassword) {
      return res.status(400).json(responseObj(false, 'Please fill all the details'));
    }

    const user = await User.findByPk(req.userData.userId, {
      attributes: ['id', 'password']
    });

    const isPasswordCorrect = bcrypt.compareSync(oldPassword, user.password);

    if(!isPasswordCorrect) {
      return res.status(400).json(responseObj(false, 'Incorrect Password'));
    }

    if(oldPassword === newPassword) {
      return res.status(400).json(responseObj(false, 'New password can not be same as old password'))
    }

    user.password = bcrypt.hashSync(newPassword, parseInt(development.salt_value));
    await user.save();
    return res.status(200).json(responseObj(true, 'Password changed'));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};