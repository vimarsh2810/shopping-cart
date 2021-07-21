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

router.put('/restoreCategory/:id', [checkAuth, checkAdmin], adminController.restoreCategory);

router.get('/lastSelectedCategory', [checkAuth, checkAdmin], adminController.getLastSelectedCategory);

/* Product Routes */

router.post('/checkProductExists', [checkAuth, checkAdmin], adminController.checkProductExists);

router.post('/product', [checkAuth, checkAdmin, upload.array('files', 3)], adminController.addProduct);

router.put('/product/:id', [checkAuth, checkAdmin], adminController.editProduct);

router.delete('/product/:id', [checkAuth, checkAdmin], adminController.deleteProduct);

router.get('/product/:id', [checkAuth, checkAdmin], adminController.getProductById);

router.get('/limitedProducts', [checkAuth, checkAdmin], adminController.getLimitedProducts);

router.put('/restoreProduct/:id', [checkAuth, checkAdmin], adminController.restoreProduct);

/* SubAdmin Routes */

router.post('/subAdmin', [checkAuth, checkSuperAdmin, signupValidator(), validate], adminController.addSubAdmin);

router.get('/subAdmin/:id', [checkAuth, checkSuperAdmin], adminController.getSubAdmin);

router.get('/subAdmins', [checkAuth, checkSuperAdmin], adminController.getAllSubAdmins);

router.put('/subAdmin/:id', [checkAuth, checkSuperAdmin, signupValidator(), validate], adminController.editSubAdmin);

router.delete('/subAdmin/:id', [checkAuth, checkSuperAdmin], adminController.deleteSubAdmin);

router.put('/restoreSubAdmin/:id', [checkAuth, checkSuperAdmin], adminController.restoreSubAdmin);

/* Brand Routes */

router.post('/brand', [checkAuth, checkAdmin], adminController.createBrand);

router.put('/brand/:id', [checkAuth, checkAdmin], adminController.updateBrand);

router.delete('/brand/:id', [checkAuth, checkAdmin], adminController.deleteBrand);

router.get('/limitedBrands', [checkAuth, checkAdmin], adminController.getLimitedBrands);

router.put('/restoreBrand/:id', [checkAuth, checkAdmin], adminController.restoreBrand);

router.post('/checkBrandExists', [validateToken, checkAdmin], adminController.checkBrandExists);

/* Other Routes */

router.put('/profile', [checkAuth, checkAdmin], adminController.editProfile);

router.get('/orders', [checkAuth, checkAdmin], adminController.getAllOrders);

router.get('/orders/:status', [checkAuth, checkAdmin], adminController.getOrdersByStatus);

router.get('/order/:id', [checkAuth, checkAdmin], adminController.getOrderById);

router.get('/order/:id/otp', [checkAuth, checkAdmin], adminController.sendDeliveryOtp);

router.post('/order/:id/otp', [checkAuth, checkAdmin], adminController.verifyDeliveryOtp);

router.get('/statistics', [checkAuth, checkAdmin], adminController.getStatistics);

router.get('/products', adminController.getAdminProducts);

module.exports = router;