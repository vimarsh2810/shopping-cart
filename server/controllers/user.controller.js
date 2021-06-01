const { responseObj } = require('../helpers/responseObj.js');
const { verifyCouponCode } = require('../helpers/verifyCouponCode.js');
const { User } = require("../models/user.js");
const { Order } = require('../models/order.js');
const { Product } = require('../models/product.js');
const { Category } = require('../models/category.js');
const { Coupon } = require('../models/coupon.js');
const { Wallet } = require('../models/wallet.js');
const { development } = require('../config/config.js');

exports.getUserData = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userData.userId);
    res.status(200).json(responseObj(true, 'Logged in user data', user));
  } catch (error) {
    return res.status(500).json(responseObj(500, false, error.message));
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll({ where: { userId: req.userData.userId }});
    return res.status(200).json(responseObj(true, 'User orders', orders));
  } catch (error) {
    return res.status(500).json(responseObj(500, false, error.message));
  }
};

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

exports.retryOrder = async (req, res, next) => {
  try {
    const { paymentSuccess, couponCode, isCouponApplied } = req.body;
    
    let couponVerified = false;
    if(isCouponApplied) {
      couponVerified = await verifyCouponCode(couponCode, req.userData.userId);
    }

    const user = await User.findByPk(req.userData.userId, {
      include: [{ model: Order, where: { id: req.params.id } }, { model: Coupon }, { model: Wallet }]
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
        amount += product.price * product.orderItem.quantity;
      });

      if(couponVerified) {
        amount /= 2;
      }

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