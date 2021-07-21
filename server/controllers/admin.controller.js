const bcrypt = require('bcryptjs');
const Sequelize = require('sequelize');

const { User } = require('../models/user.js');
const { Product } = require('../models/product.js');
const { Order } = require('../models/order.js');
const { responseObj } = require('../helpers/responseObj.js');
const { development } = require('../config/config.js');
const { Category } = require('../models/category.js');
const { pagination, paginationMetaData } = require('../helpers/pagination.js');
const { generateOtp } = require('../helpers/generateOtp.js');
const { deliverMail } = require('../helpers/nodeMailer.js');
const { Review } = require('../models/review.js');
const { Brand } = require('../models/brand.js');
const { ProductImage } = require('../models/productImage.js');

/* @desc Create a SubAdmin */
/* @route POST /admin/subAdmin */

exports.addSubAdmin = async (req, res, next) => {
  try {
    const user = await User.create({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, parseInt(development.salt_value)),
      isActive: true,
      userRoleId: development.roles.SubAdmin
    });

    return res.status(200).json(responseObj(true, 'Sub Admin Created.'));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

/* @desc Get a SubAdmin's Info by ID */
/* @route GET /admin/subAdmin/:id */

exports.getSubAdmin = async (req, res, next) => {
  try {
    const subAdmin = await User.findOne({ 
      where: { 
        id: req.params.id, 
        userRoleId: development.roles.SubAdmin 
      }, 
      attributes: ['id', 'name', 'username', 'email']
    });

    return res.status(200).json(responseObj(true, `SubAdmin having ID = ${req.params.id}`, subAdmin));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

/* @desc Get all SubAdmins */
/* @route GET /admin/subAdmins */

exports.getAllSubAdmins = async (req, res, next) => {
  try {
    const subAdmins = await User.findAll({
      paranoid: false,
      where: { 
        userRoleId: development.roles.SubAdmin 
      },
      attributes: ['id', 'name', 'username', 'email', 'deletedAt']
    });
    return res.status(200).json(responseObj(true, `All SubAdmins`, subAdmins));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

/* @desc Edit a subadmin's details */
/* @route PUT /admin/subAdmin/:id */

exports.editSubAdmin = async (req, res, next) => {
  try {
    const { name, username, email, password } = req.body;
    const subAdmin = await User.findOne({ where: { id: req.params.id, userRoleId: development.roles.SubAdmin }});
    subAdmin.name = name;
    subAdmin.username = username;
    subAdmin.email = email;
    subAdmin.password = bcrypt.hashSync(password, parseInt(development.salt_value));
    await subAdmin.save();
    return res.status(200).json(responseObj(true, `SubAdmin details edited successfully`));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

/* @desc Delete a subadmin by ID */
/* @route DELETE /admin/subAdmin/:id */

exports.deleteSubAdmin = async (req, res, next) => {
  try {
    await User.destroy({ where: { id: req.params.id, userRoleId: development.roles.SubAdmin }});
    return res.status(200).json(responseObj(true, 'SubAdmin Deleted'));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

/* @desc Restore deleted subAdmin */
/* @route PUT /admin/restoreSubAdmin/:id */

exports.restoreSubAdmin = async (req, res, next) => {
  try {
    const subAdmin = await User.restore({ where: { id: req.params.id, userRoleId: development.roles.SubAdmin } });
    return res.status(200).json(responseObj(true, 'SubAdmin restored'));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

/* @desc Check if Product title available */
/* @route POST /admin/checkProductExists */

exports.checkProductExists = async (req, res, next) => {
  try {
    const { title } = req.body;
    const productExists = await Product.findOne({ where: { title: title } });
    if(productExists) {
      return res.status(200).json(responseObj(false, 'Product Exists', 'Product with this title already exists!'));
    }
    return res.status(200).json(responseObj(true, 'Product does not Exists', 'Product title available.'));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

/* @desc Create a Product */
/* @route POST /admin/product */

exports.addProduct = async (req, res, next) => {
  try {

    const { title, brandId, price, description, categoryId } = req.body;
    
    if(!title || !brandId || !price || !description || !categoryId ) {
      return res.status(400).json(responseObj(false, 'All details should be filled'));
    }

    const user = await User.findByPk(req.userData.userId);
    const product = await user.createProduct({
      title: title,
      price: price,
      brandId: brandId,
      description: description,
      categoryId: categoryId,
      imagePath: `/img/products/${req.fileName}`
    });

    await req.files.forEach(async (file) => {
      console.log(file);
      await product.createProductImage({
        path: `/img/products/${file.filename}`
      });
    });

    return res.status(200).json(responseObj(true, 'Product created.', product));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

/* @desc Edit a Product */
/* @route PUT /admin/product/:id */

exports.editProduct = async (req, res, next) => {
  try {
    const { title, brandId, price, description, categoryId } = req.body;

    if(!title || !brandId || !price || !description || !categoryId) {
      return res.status(400).json(responseObj(false, 'All details should be filled'));
    }

    const product = await Product.findByPk(req.params.id);
    product.title = title;
    product.brandId = brandId;
    product.description = description;
    product.price = price;
    product.categoryId = categoryId;
    await product.save();
    return res.status(200).json(responseObj(true, 'Product Updated'));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

/* @desc Delete a Product */
/* @route DELETE /admin/product/:id */

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    await product.destroy();
    return res.status(200).json(responseObj(true, 'Product Deleted'));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

// @desc Get limited products
// @route GET /admin/limitedProducts

exports.getLimitedProducts = async (req, res, next) => {
  try {

    let { page, limit, includeCategory } = req.query;
    const { offset, size } = pagination(page, limit);
    let items;
    if(includeCategory) {
      items = await Product.findAndCountAll({
        paranoid: false,
        include: [ 
          { 
            model: Category, attributes: ['title'] 
          },
          {
            model: ProductImage
          }
        ],
        limit: size,
        offset: offset
      });
    } else {
      items = await Product.findAndCountAll({ 
        limit: size,
        offset: offset,
        include: [{ model: ProductImage }]
      });
    }
    
    const result = paginationMetaData(items, page, size);
    
    return res.status(200).json(responseObj(true, 'Paginated Products', {
      productCount: result.count,
      products: result.rows,
      totalPages: result.totalNoOfPages,
      currentPage: result.currentPage
    }));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

/* @desc Put Restore product by ID */
/* @route PUT /admin/restoreProduct/:id */

exports.restoreProduct = async (req, res, next) => {
  try {
    const product = await Product.restore({ where: { id: req.params.id } });
    return res.status(200).json(responseObj(true, 'Product Restored'));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

/* @desc Get a Product by ID */
/* @route GET /admin/product/:id */

exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        { 
          model: Category,
          attributes: ['id','title', 'parentId']
        },
        {
          model: ProductImage
        }
      ]
    });
    return res.status(200).json(responseObj(true, `Product having ID = ${req.params.id}`, product));
  } catch (error) {
    console.log(error)
    return res.status(500).json(responseObj(false, error.message));
  }
};

/* @desc Check category already Exists */
/* @route POST /admin/checkCategoryExists */

exports.checkCategoryExists = async (req, res, next) => {
  try {
    const { title } = req.body;
    const categoryExists = await Category.findOne({ where: { title: title } });
    if(categoryExists) {
      return res.status(200).json(responseObj(false, 'Category Exists', 'Category with this title already exists!'));
    }
    return res.status(200).json(responseObj(true, 'Category does not Exists', 'Category title available.'));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

/* @desc Create a category */
/* @route POST /admin/category */

exports.addCategory = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userData.userId);
    const category = await user.createCategory({
      title: req.body.title,
      parentId: req.body.parentId || null
    });
    return res.status(200).json(responseObj(true, 'Category created.', category));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message, [error.message]));
  }
};

/* @desc Edit a category */
/* @route PUT /admin/category/:id */

exports.editCategory = async (req, res, next) => {
  try {
    const { title, parentId } = req.body;
    if(!title) {
      return res.status(400).json(responseObj(false, 'All details required'));
    }
    if(req.params.id === parentId) {
      return status(400).json(responseObj(false, 'A category can not be parent of itself'));
    }
    const category = await Category.findByPk(req.params.id);
    category.title = title;
    category.parentId = parentId || null;
    await category.save();
    return res.status(200).json(responseObj(true, 'Category updated'));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

/* @desc Delete a category */
/* @route DELETE /admin/category/:id */

exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);
    await category.destroy();
    return res.status(200).json(responseObj(true, 'Category deleted'));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

/* @desc Get category by ID */
/* @router GET /admin/category/:id */

exports.getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);
    return res.status(200).json(responseObj(true, 'Category with ID = ${req.params.id}', category));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

/* @desc Get all categories */
/* @route GET /admin/categories */

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll({ 
      where: { 
        parentId: null 
      },
      logging: false
    });
    for(let category of categories) {
      category.dataValues.children = await category.getChildren({ logging: false });
    }
    return res.status(200).json(responseObj(true, 'Categories', categories));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

/* @desc Get limited categories */
/* @route GET /admin/limitedCategories */

exports.getLimitedCategories = async (req, res, next) => {
  try {

    let { page, limit, includeCategory } = req.query;
    const { offset, size } = pagination(page, limit);
    let items = await Category.findAndCountAll({
      paranoid: false,
      include: [{ 
        model: Category,
        as: 'parent',
        attributes: ['id', 'title'] 
      }, 
      { 
        model: User, 
        attributes: ['id', 'name', 'username']
      }],
      limit: size,
      offset: offset
    });

    const result = paginationMetaData(items, page, size);

    return res.status(200).json(responseObj(true, 'Paginated Categories', {
      categoryCount: result.count,
      categories: result.rows,
      totalPages: result.totalNoOfPages,
      currentPage: result.currentPage
    }));
  } catch (error) {
    console.log(error)
    return res.status(500).json(responseObj(false, error.message));
  }
};

/* @desc Put Restore category by ID */
/* @route PUT /admin/restoreCategory/:id */

exports.restoreCategory = async (req, res, next) => {
  try {
    const category = await Category.restore({ where: { id: req.params.id } });
    return res.status(200).json(responseObj(true, 'Category restored'));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

/* @desc Get last selected category */
/* @route GET /admin/lastSelectedCategory */

exports.getLastSelectedCategory = async (req, res, next) => {
  try {
    const products = await Product.findAll({
      order: [
        ['createdAt', 'DESC']
      ],
      limit: 1,
      include: [{
        model: Category
      }]
    });

    return res.status(200).json(responseObj(true, 'Last Inserted', products[0].category));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

/* @desc Edit Admin Profile */
/* @route PUT /admin/profile */

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

/* @desc Get all orders of all users */
/* @route GET /admin/orders */

exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      include: [{ model: User }]
    });
    return res.status(200).json(responseObj(true, "All Orders", orders));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

/* @desc Get orders by Status */
/* @route GET /admin/orders/:status */

exports.getOrdersByStatus = async (req, res, next) => {
  try {
    let { page, limit, includeCategory } = req.query;
    const { offset, size } = pagination(page, limit);

    const items = await Order.findAndCountAll({
      where: { status: req.params.status },
      include: [{ model: User }],
      limit: size,
      offset: offset
    });

    const result = paginationMetaData(items, page, size);
    return res.status(200).json(responseObj(true, `${req.params.status} Orders`, {
      orders: result.rows,
      totalPages: result.totalNoOfPages,
      currentPage: result.currentPage
    }));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

/* @desc Get orders by Id and its products */
/* @route GET /admin/orders/:id */

exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [{ model: Product, include: [{ model: Category, attributes: ['title'] }] }]
    });
    return res.status(200).json(responseObj(true, `Order having ID = ${req.params.id}`, order));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

/* @desc Send delivery otp to customer's email */
/* @route GET /admin/orders/:id/otp */

exports.sendDeliveryOtp = async (req, res, next) => {
  try {
    const order = await Order.findOne({ 
      where: { id: req.params.id }, 
      attributes: ['id', 'deliveryOtp'],
      include: [{ model: User, attributes: ['id', 'username', 'email']}]
    });
    order.deliveryOtp = generateOtp();
    await order.save();
    deliverMail(
      { 
        email: order.user.email, 
        otp: order.deliveryOtp 
      }, 
      'Delivery OTP',
      'Share this OTP with delivery person: '
    );
    return res.status(200).json(responseObj(true, `Delivery OTP sent to Customer's Email ID`));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

/* @desc Verify delivery otp */
/* @route POST /admin/orders/:id/otp */

exports.verifyDeliveryOtp = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if(order.deliveryOtp !== parseInt(req.body.deliveryOtp)) {
      return res.status(400).json(responseObj(false, 'Incorrect OTP'));
    }
    order.status = development.orderStatus.Delivered;
    await order.save();
    return res.status(200).json(responseObj(true, 'OTP Verified'));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

/* @desc Get Admin Dashboard Statistics */
/* @route GET /admin/statistics */

exports.getStatistics = async (req, res, next) => {
  try {
    const productsCount = await Product.count();
    const categoriesCount = await Category.count();
    const brandsCount = await Brand.count();
    const totalAmountEarned = await Order.sum('amount', { 
      where: {
        status: {
          [Sequelize.Op.or]: [development.orderStatus.InProcess, development.orderStatus.Delivered]
        }
      }
    });

    return res.status(200).json(responseObj(true, 'Statistics', {
      productsCount, categoriesCount, brandsCount, totalAmountEarned
    }));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

exports.getAdminProducts = async (req, res, next) => {
  try {
    const product = await Product.findByPk(1, {
      attributes: [
        'id', 'title', 
        'price', 'description', 
        'categoryId', 'imagePath', 
        [Sequelize.fn('avg', Sequelize.col('reviews.rating')), 'avgRating']
      ],
      include: [{ model: Review, attributes: [] }]
    });
    const reviews = await product.getReviews();
    product.dataValues.reviews = reviews;
    console.log(product.reviews);
    return res.status(200).json(responseObj(true, 'Products', product))
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

/* @desc POST Create a brand record in DB */
/* @route POST /admin/brand */

exports.createBrand = async (req, res, next) => {
  try {
    const brand = await Brand.create({
      name: req.body.name
    });
    return res.status(200).json(responseObj(true, 'Brand Created'));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

/* @desc PUT Update a brand record in DB */
/* @route PUT /admin/brand/:id */

exports.updateBrand = async (req, res, next) => {
  try {
    const brandExists = await Brand.findOne({ where: {
      id: {
        [Sequelize.Op.not]: req.params.id
      },
      name: req.body.name,
    }});
    if(brandExists) {
      return res.status(404).json(responseObj(false, 'Brand Exists', 'Brand with this name already exists!'));
    }
    const brand = await Brand.findByPk(req.params.id);
    brand.name = req.body.name;
    await brand.save();
    return res.status(200).json(responseObj(true, 'Brand Updated'));
  } catch (error) {
    console.log(error)
    return res.status(500).json(responseObj(false, error.message));
  }
};

/* @desc DELETE Delete a brand record from DB */
/* @route DELETE /admin/brand/:id */

exports.deleteBrand = async (req, res, next) => {
  try {
    const brand = await Brand.destroy({ where: { id: req.params.id } });
    return res.status(200).json(responseObj(true, 'Brand Deleted'));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

/* @desc Check if Brand name available */
/* @route POST /admin/checkBrandExists */

exports.checkBrandExists = async (req, res, next) => {
  try {
    const { name } = req.body;
    const brandExists = await Brand.findOne({ where: { name: name } });
    if(brandExists) {
      return res.status(200).json(responseObj(false, 'Brand Exists', 'Brand with this name already exists!'));
    }
    return res.status(200).json(responseObj(true, 'Brand does not Exists', 'Brand name available.'));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

/* @desc Get limited brands */
/* @route GET /admin/limitedBrands */

exports.getLimitedBrands = async (req, res, next) => {
  try {

    let { page, limit } = req.query;
    const { offset, size } = pagination(page, limit);
    let items = await Brand.findAndCountAll({
      paranoid: false,
      limit: size,
      offset: offset
    });

    const result = paginationMetaData(items, page, size);

    return res.status(200).json(responseObj(true, 'Paginated Brands', {
      categoryCount: result.count,
      brands: result.rows,
      totalPages: result.totalNoOfPages,
      currentPage: result.currentPage
    }));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};

/* @desc Put Restore brand by ID */
/* @route PUT /admin/restoreBrand/:id */

exports.restoreBrand = async (req, res, next) => {
  try {
    const brand = await Brand.restore({ where: { id: req.params.id } });
    return res.status(200).json(responseObj(true, 'Brand restored'));
  } catch (error) {
    return res.status(500).json(responseObj(false, error.message));
  }
};