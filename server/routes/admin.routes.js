const express = require('express');

const adminController = require('../controllers/admin.controller.js');
const { checkAdmin, checkSuperAdmin } = require('../middlewares/checkRole.js');
const { validateToken } = require('../middlewares/validateToken.js');
const { upload } = require('../middlewares/uploadImage.js');
const { categoryValidator, signupValidator, validate } = require('../middlewares/validator.js');
const { checkAuth } = require('../middlewares/checkAuth.js');

const router = express.Router();

/* Category Routes */

router.post('/checkCategoryExists', [checkAuth, checkAdmin], adminController.checkCategoryExists);

router.get('/category/:id', [checkAuth, checkAdmin], adminController.getCategoryById);

router.post('/category', [checkAuth, checkAdmin, categoryValidator(), validate], adminController.addCategory);

router.put('/category/:id', [checkAuth, checkAdmin, categoryValidator(), validate], adminController.editCategory);

router.delete('/category/:id', [checkAuth, checkAdmin], adminController.deleteCategory);

router.get('/categories', [checkAuth, checkAdmin], adminController.getAllCategories);

router.get('/limitedCategories', [checkAuth, checkAdmin], adminController.getLimitedCategories);

router.get('/lastSelectedCategory', [checkAuth, checkAdmin], adminController.getLastSelectedCategory);

/* Product Routes */

router.post('/checkProductExists', [checkAuth, checkAdmin], adminController.checkProductExists);

router.post('/product', [checkAuth, checkAdmin, upload.single("file")], adminController.addProduct);

router.put('/product/:id', [checkAuth, checkAdmin], adminController.editProduct);

router.delete('/product/:id', [checkAuth, checkAdmin], adminController.deleteProduct);

router.get('/product/:id', [checkAuth, checkAdmin], adminController.getProductById);

/* SubAdmin Routes */

router.post('/subAdmin', [validateToken, checkSuperAdmin, signupValidator(), validate], adminController.addSubAdmin);

router.get('/subAdmin/:id', [validateToken, checkSuperAdmin], adminController.getSubAdmin);

router.get('/subAdmins', [validateToken, checkSuperAdmin], adminController.getAllSubAdmins);

router.put('/subAdmin/:id', [validateToken, checkSuperAdmin, signupValidator(), validate], adminController.editSubAdmin);

router.delete('/subAdmin/:id', [validateToken, checkSuperAdmin], adminController.deleteSubAdmin);

/* Brand Routes */

router.post('/brand', [checkAuth, checkAdmin], adminController.createBrand);

router.put('/brand/:id', [checkAuth, checkAdmin], adminController.updateBrand);

router.delete('/brand/:id', [checkAuth, checkAdmin], adminController.deleteBrand);

router.get('/limitedBrands', [checkAuth, checkAdmin], adminController.getLimitedBrands);

router.post('/checkBrandExists', [validateToken, checkAdmin], adminController.checkBrandExists);

/* Other Routes */

router.put('/profile', [validateToken, checkAdmin], adminController.editProfile);

router.get('/orders', [validateToken, checkAdmin], adminController.getAllOrders);

router.get('/orders/:status', [validateToken, checkAdmin], adminController.getOrdersByStatus);

router.get('/order/:id', [validateToken, checkAdmin], adminController.getOrderById);

router.get('/order/:id/otp', [validateToken, checkAdmin], adminController.sendDeliveryOtp);

router.post('/order/:id/otp', [validateToken, checkAdmin], adminController.verifyDeliveryOtp);

router.get('/statistics', [validateToken, checkAdmin], adminController.getStatistics);

router.get('/products', adminController.getAdminProducts);

module.exports = router;