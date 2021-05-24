const bcrypt = require('bcryptjs');
require('dotenv').config();

const { createToken } = require('../helpers/createToken.js');
const { deliverMail } = require('../helpers/nodeMailer.js');
const { responseObj } = require('../helpers/responseObj.js');
const { User } = require('../models/user.js');

const tokenExpirationTime = 60*60;

exports.signup = async (req, res, next) => {
  try {
    const token = createToken({ email: req.body.email }, 10*60);
    const user = await User.create({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 12),
      activationToken: token,
      userRoleId: 3
    });

    const cart = await user.createCart();
    const wishList = await user.createWishList();
    
    const link = req.protocol + '://' + req.get('host') + '/auth/verifyEmail' + '/' + user.id + '/' + user.activationToken;
    const mailOptions = {
      from: process.env.MAIL_ID,
      to: user.email,
      subject: 'Email Verification',
      text: `Click the link to verify your email: ${link}`
    };
    deliverMail(mailOptions);
    
    return res.status(200).json(responseObj(true, `Registration Successful, check your email for verification`));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userId);
    if(user.activationToken !== req.params.token) {
      return res.status(400).json(responseObj(false, 'Invalid Token'));
    }
    user.isActive = true;
    await user.save();
    const wallet = await user.createWallet();
    wallet.amount = 100000;
    await wallet.save();
    const coupon = await user.createCoupon({
      code: 'WELCOME' + user.username.toUpperCase()
    });
    return res.status(200).json(responseObj(true, 'Email Verified'));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

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