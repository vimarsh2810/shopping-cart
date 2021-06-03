const { responseObj } = require("../helpers/responseObj");
const { User } = require("../models/user");
const sequelize = require('../config/db.js');
const { Cart } = require("../models/cart");
const { Product } = require("../models/product");
const { Coupon } = require("../models/coupon");
const { verifyCouponCode } = require("../helpers/verifyCouponCode");
const { development } = require('../config/config.js');
const { Wallet } = require("../models/wallet");
const { Order } = require("../models/order");

/* @desc Add product to user cart */
/* @route POST /cart/addToCart */

exports.addToCart = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userData.userId, {
      include: [{ model: Cart}]
    });
    if(!user.isActive) {
      return res.status(403).json(responseObj(false, 'Verify Email Id to add products in cart'));
    }
    const result = await sequelize.query('CALL add_to_cart(:cartId, :productId, :quantity)', {
      replacements: { cartId: user.cart.id, productId: parseInt(req.body.productId), quantity: parseInt(req.body.quantity) }
    });
    res.status(200).json(responseObj(true, 'Product Added to cart'));
  } catch (error) {
    return res.status(500).json(responseObj(500, false, 'Internal Server Error'));
  }
};

/* @desc Get all cart products */
/* @route GET /cart/cartProducts */

exports.getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ 
      where: { userId:req.userData.userId },
      include: [{ model: Product }],
      logging: false
    });
    return res.status(200).json(responseObj(200, 'Your Cart', cart));
  } catch (error) {
    return res.status(500).json(responseObj(500, false, error.message));
  }
};

/* @desc Delete a product from user cart */
/* @route DELETE /cart/deleteCartItem/:productId */

exports.deleteCartItem = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ 
      where: { userId: req.userData.userId }, 
      include: [{ 
        model: Product, 
        where: { id: req.params.productId } 
      }],
      logging: false 
    });
    await cart.products[0].cartItem.destroy();
    return res.status(200).json(responseObj(true, 'Deleted'));
  } catch (error) {
    return res.status(500).json(responseObj(500, false, error.message));
  }
};

exports.deleteCartItemSP = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userData.userId, {
      include: [{ model: Cart }]
    });

    const result = await sequelize.query('CALL remove_from_cart(:cartId, :productId)', {
      replacements: { cartId: user.cart.id, productId: parseInt(req.params.productId) }
    });

    return res.status(200).json(responseObj(200, 'Product deleted from cart Cart'));
  } catch (error) {
    return res.status(500).json(responseObj(500, false, error.message));
  }
};

/* @desc Update product quantity in cart */
/* @route PUT /cart/updateQuantity/:productId */

exports.updateQuantity = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ 
      where: { userId: req.userData.userId }, 
      include: [{ 
        model: Product, 
        where: { id: req.params.productId } 
      }] 
    });
    cart.products[0].cartItem.quantity = parseInt(req.body.quantity);
    await cart.products[0].cartItem.save();
    return res.status(200).json(responseObj(true, 'Quantity Updated'));
  } catch (error) {
    return res.status(500).json(responseObj(500, false, error.message));
  }
};

/* @desc Verify coupon applied is correct or not */
/* @route POST /cart/verifyCoupon */

exports.verifyCoupon = async (req, res, next) => {
  try {
    const { couponCode } = req.body;
    const couponVerified = await verifyCouponCode(couponCode, req.userData.userId);
    console.log(couponVerified)
    if(!couponVerified) {
      return res.status(400).json(responseObj(false, 'Invalid Coupon Code'));
    }
    return res.status(200).json(responseObj(true, 'Valid Coupon Code'));
  } catch (error) {
    return res.status(500).json(responseObj(500, false, error.message));
  }
};

/* @desc Get payment amount fot order */
/* GET /cart/paymentAmount */

exports.getPaymentAmount = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userData.userId, {
      include: [{ model: Cart}]
    });
    const { isCouponApplied } = req.body;
    const products = await user.cart.getProducts();
    let amount = 0;
    
    if(products.length > 0) {
      products.forEach((product) => {
        product.price = parseFloat(product.price);
        amount += product.cartItem.quantity * product.price;
      });
      if(isCouponApplied) {
        return res.status(200).json(responseObj(true, 'Amount', {
          totalAmount: amount,
          finalAmount: amount / 2,
          discount: 50
        }));
      }
      return res.status(200).json(responseObj(true, 'Amount', {
        totalAmount: amount,
        finalAmount: amount,
        discount: 0
      }));
    }
    
    return res.status(400).json(responseObj(false, 'No products in cart'));
  } catch (error) {
    return res.status(500).json(responseObj(500, false, error.message));
  }
}

/* @desc Payment */
/* @route POST /cart/payment */

exports.payment = async (req, res, next) => {
  try {

    const { paymentSuccess, couponCode, isCouponApplied } = req.body;
    if(!paymentSuccess) {
      return res.status(400).json(responseObj(false, 'Payment Failed'));
    }

    let couponVerified = false;
    if(isCouponApplied) {
      couponVerified = await verifyCouponCode(couponCode, req.userData.userId);
    }

    const user = await User.findByPk(req.userData.userId, {
      include: [{ model: Cart }, { model: Coupon }, { model: Wallet }]
    });

    const products = await user.cart.getProducts();

    if(products.length > 0) {
      const order = await user.createOrder();
      let amount = 0;

      products.forEach((product) => {
        product.price = parseFloat(product.price);
        amount += product.price * product.cartItem.quantity;
      });

      if(couponVerified) {
        order.amount = amount / 2;
      } else {
        order.amount = amount;
      }

      const result = await order.addProducts(products.map(product => {
        product.orderItem = { quantity: product.cartItem.quantity };
        return product;
      }));

      user.wallet.balance = parseFloat(user.wallet.balance);
      order.amount = parseFloat(order.amount);
      if(user.wallet.balance < order.amount) {
        order.status = development.orderStatus.Failed;
        await order.save();
        return res.status(400).json(responseObj(false, 'Balance Insufficient'))
      }

      order.status = development.orderStatus.InProcess;
      await order.save();
      user.coupon.isUsed = true;
      user.wallet.balance -= order.amount;
      await user.coupon.save();
      await user.wallet.save();
      await user.cart.setProducts(null);
      return res.status(200).json(responseObj(true, 'Order Created', order));
    }
    return res.status(404).json(responseObj(false, 'No products in cart'));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};