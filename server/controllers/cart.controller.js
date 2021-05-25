const { responseObj } = require("../helpers/responseObj");
const { User } = require("../models/user");
const sequelize = require('../config/db.js');
const { Cart } = require("../models/cart");
const { Product } = require("../models/product");

exports.addToCart = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userData.userId, {
      include: [{ model: Cart}]
    });
    // const result = await sequelize.query(`CALL add_to_cart(${user.cart.id}, ${parseInt(req.body.productId)}, ${parseInt(req.body.quantity)})`);
    const result = await sequelize.query('CALL add_to_cart(:cartId, :productId, :quantity)', {
      replacements: { cartId: user.cart.id, productId: parseInt(req.body.productId), quantity: parseInt(req.body.quantity) }
    });
    res.status(200).json(responseObj(true, 'Product Added to cart'));
  } catch (error) {
    return res.status(500).json(responseObj(500, false, 'Internal Server Error'));
  }
};

exports.getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ 
      where: { userId:req.userData.userId },
      include: [{ model: Product }]
    });
    return res.status(200).json(responseObj(200, 'Your Cart', cart));
  } catch (error) {
    return res.status(500).json(responseObj(500, false, error.message));
  }
};

exports.deleteCartItem = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ where: { userId: req.userData.userId }, include: [{ model: Product, where: { id: req.params.productId } }] });
    await cart.products[0].cartItem.destroy();
    return res.status(200).json(responseObj(true, 'Deleted'));
  } catch (error) {
    return res.status(500).json(responseObj(500, false, error.message));
  }
};

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
}