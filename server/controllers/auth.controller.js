const bcrypt = require('bcryptjs');

const { createToken } = require('../helpers/createToken.js');
const { deliverMail } = require('../helpers/nodeMailer.js');
const { responseObj } = require('../helpers/responseObj.js');
const { User } = require('../models/user.js');

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
    res.redirect(`/auth/sendVerificationMail/${user.id}`);
    
    // return res.status(200).json(responseObj(true, `Registration Successful, userId: ${user.id}`));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

exports.sendVerificationMail = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    
    const link = req.protocol + '://' + req.get('host') + '/auth/verifyEmail' + '/' + user.id + '/' + user.activationToken;
    const mailOptions = {
      from: 'darshsharma2810@gmail.com',
      to: user.email,
      subject: 'Email Verification',
      text: `Click the link to verify your email: ${link}`
    };
    deliverMail(mailOptions);
    res.redirect('/auth/login');
  } catch (error) {
    console.log(error)
    return res.status(500).json(responseObj(false, error.message));
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userId);
    console.log(user)
    if(user.activationToken == req.params.token) {
      user.isActive = true;
      await user.save();
      return res.status(200).json(responseObj(true, 'Email Verified'));
    }
    return res.status(400).json(responseObj(false, 'Invalid Token'));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

exports.login = async (req, res, next) => {
  try {
    console.log(req.originalUrl)
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
    }, 60*60);

    return res.status(200).json(responseObj(true, 'Login Successful!', {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      isActive: user.isActive
    }, token));
    
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};