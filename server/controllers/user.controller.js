const Sequelize = require('sequelize');

const { responseObj } = require('../helpers/responseObj.js');
const { verifyCouponCode } = require('../helpers/verifyCouponCode.js');
const { User } = require("../models/user.js");
const { Order } = require('../models/order.js');
const { Product } = require('../models/product.js');
const { Category } = require('../models/category.js');
const { Coupon } = require('../models/coupon.js');
const { Wallet } = require('../models/wallet.js');
const { development } = require('../config/config.js');
const { WishList } = require('../models/wishList.js');
const { WishListItem } = require('../models/wishListItem.js');

/* @desc Get data of logged in user */
/* @route GET /user/data */

exports.getUserData = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userData.userId);
    return res.status(200).json(responseObj(true, 'Logged in user data', {
      name: user.name,
      username: user.username,
      email: user.username,
      roleId: user.userRoleId,
      isActive: user.isActive
    }));
    console.log(user);
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

/* @desc Get wallet balance of logged in user */
/* @route GET /user/walletBalance */

exports.getWalletBalance = async (req, res, next) => {
  try {
    const wallet = await Wallet.findOne({ 
      where: { userId: req.userData.userId }, 
      attributes: ['id', 'balance', 'userId'] 
    });

    return res.status(200).json(responseObj(true, 'Wallet Balance', { balance: wallet.balance }));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

/* @desc Get all orders of logged in user */
/* @route GET /user/orders */

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll({ where: { userId: req.userData.userId }});
    return res.status(200).json(responseObj(true, 'User orders', orders));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

/* @desc Get order details and products by orderid */
/* @route GET /user/order/:id */

exports.getOrderProducts = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [{ model: Product, include: [{ model: Category, attributes: ['title']}] }], 
    });
    return res.status(200).json(responseObj(true, 'Order Products', order));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

/* @desc Get order amount by orderid */
/* @route GET /user/orderAmount/:id */

exports.getOrderAmount = async (req, res, next) => {
  try {

    const { isCouponApplied } = req.body;

    const order = await Order.findByPk(req.params.id, {
      attributes: ['amount']
    });

    const amountObj = {
      totalAmount: order.amount,
      finalAmount: isCouponApplied ? order.amount / 2 : order.amount
    };

    if(isCouponApplied) {
      order.amount /= 2;
    }
    return res.status(200).json(responseObj(true, 'Amount', amountObj));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

/* @desc Retry a failed order */
/* @route POST /user/retryOrder/:id */

exports.retryOrder = async (req, res, next) => {
  try {
    const { paymentSuccess, couponCode, isCouponApplied } = req.body;
    
    let couponVerified = false;
    if(isCouponApplied) {
      couponVerified = await verifyCouponCode(couponCode, req.userData.userId);
    }

    const user = await User.findByPk(req.userData.userId, {
      include: [{ model: Order, where: { id: req.params.id } }, { model: Coupon }, { model: Wallet }],
      logging: false
    });

    if(!paymentSuccess) {
      user.orders[0].status = development.orderStatus.Failed;
      await user.orders[0].save();
      return res.status(400).json(responseObj(false, 'Payment Failed'));
    }

    if(user.orders[0].status == (development.orderStatus.InProcess || development.orderStatus.Delivered) ) {
      return res.status(400).json(responseObj(false, 'Payment for this order is already done!'));
    }

    const products = await user.orders[0].getProducts();

    if(products.length > 0) {
      let amount = 0;
      products.forEach((product) => {
        product.price = parseFloat(product.price);
        amount += product.price * product.orderItem.quantity;
      });

      if(couponVerified) {
        amount /= 2;
      }

      user.wallet.balance = parseFloat(user.wallet.balance);
      user.orders[0].amount = parseFloat(user.orders[0].amount);

      if(user.wallet.balance < user.orders[0].amount) {
        user.orders[0].status = development.orderStatus.Failed;
        await user.orders[0].save();
        return res.status(400).json(responseObj(false, 'Balance Insufficient'))
      }

      user.orders[0].amount = amount;
      user.orders[0].status = development.orderStatus.InProcess;
      await user.orders[0].save();
      user.coupon.isUsed = true;
      user.wallet.balance -= user.orders[0].amount;
      await user.coupon.save();
      await user.wallet.save();
      return res.status(200).json(responseObj(true, 'Order Successful', user.orders[0]));
    }
    return res.status(404).json(responseObj(false, 'No products in this order'));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

/* @desc Cancel an order by Id */
/* @route PUT /user/order/cancel/:id */

exports.cancelOrder = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userData.userId, {
      include: [{ 
        model: Order, 
        where: { id: req.params.id }
      }, 
      { 
        model: Wallet 
      }]
    });
    user.orders[0].status = development.orderStatus.Cancelled;
    user.wallet.balance = parseFloat(user.wallet.balance);
    user.orders[0].amount = parseFloat(user.orders[0].amount);
    user.wallet.balance += user.orders[0].amount;
    await user.orders[0].save();
    await user.wallet.save();
    return res.status(200).json(responseObj(true, 'Order Cancelled'));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

/* @desc Get Notifications */
/* @route GET /user/notifications */

exports.getNotifications = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userData.userId);
    if(user.isActive) {
      return res.status(200).json(responseObj(false, 'Email is already verified', []));
    }

    const notifications = [
      'Verify Email to get personalized Coupon',
      'Verify Email to get bonus amount',
      'Verify Email to purchase products',
    ];

    return res.status(200).json(responseObj(true, 'Notifications', notifications));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

/* @desc Edit User Profile */
/* @route PUT /user/profile */

exports.editProfile = async (req, res, next) => {
  try {
    const { name, username, email } = req.body;
    const userExist = await User.findOne({ 
      where: { 
        [Sequelize.Op.or]: {
          email: email, 
          username: username
        },
        id: {
          [Sequelize.Op.not]: req.userData.userId
        }
      } 
    });

    if(userExist) {
      return res.status(409).json(responseObj(false, 'Username or email already in use'));
    }

    const user = await User.findByPk(req.userData.userId);
    user.name = name;
    user.username = username;
    user.email = email;
    await user.save();
    return res.status(200).json(responseObj(true, 'Profile Updated'));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

/* @desc Get User's WishList */
/* @route GET /user/wishList */

exports.getWishList = async (req, res, next) => {
  try {
    const wishList = await WishList.findOne({ 
      where: { 
        userId: req.userData.userId 
      },
      include: [{ model: Product }]
    });

    return res.status(200).json(responseObj(true, 'WishList', wishList));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

/* @desc Add product to User's WishList */
/* @route POST /user/wishList/:id */

exports.addToWishList = async (req, res, next) => {
  try {
    const wishList = await WishList.findOne({ where: { userId: req.userData.userId } });
    const product = await Product.findByPk(req.params.id);
    const alreadyHasProduct = await wishList.hasProduct(product);
    if(alreadyHasProduct) {
      return res.status(200).json(responseObj(false, 'Product is already in the wishList'));
    }
    await wishList.addProduct(product);
    return res.status(200).json(responseObj(true, 'Product Added to wishList'));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

/* @desc Remove product from User's WishList */
/* @route DELETE /user/wishList/:id */

exports.removeFromWishList = async (req, res, next) => {
  try {
    const wishList = await WishList.findOne({ where: { userId: req.userData.userId } });
    const products = await wishList.getProducts({ where: { id: req.params.id }});
    if(products.length <= 0) {
      return res.status(200).json(responseObj(false, 'Product not in wishList'));
    }
    await products[0].wishListItem.destroy();
    return res.status(200).json(responseObj(true, 'Product deleted from wishList'));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};