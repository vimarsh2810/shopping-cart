const Sequelize = require('sequelize');

const sequelize = require('../config/db.js');
const { CartItem } = require('./cartItem.js');
const { Cart } = require('./cart.js');
const { User } = require('./user.js');
const { UserRole } = require('./userRole.js');
const { Product } = require('./product.js');
const { ProductImage } = require('./productImage.js');
const { Category } = require('./category.js');
const { Order } = require('./order.js');
const { OrderItem } = require('./orderItem.js');
const { WishList } = require('./wishList.js');
const { WishListItem } = require('./wishListItem.js');
const { Wallet } = require('./wallet.js');
const { Coupon } = require('./coupon.js');
const { Review } = require('./review.js');
const { Brand } = require('./brand.js');

const db = {}

db.user = User;
db.userRole = UserRole;
db.category = Category;
db.product = Product;
db.productImage = ProductImage;
db.cart = Cart;
db.cartItem = CartItem;
db.order = Order;
db.orderItem = OrderItem;
db.wishList = WishList;
db.wishListItem = WishListItem;
db.wallet = Wallet;
db.coupon = Coupon;
db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.review = Review;
db.brand = Brand;

module.exports = { db };