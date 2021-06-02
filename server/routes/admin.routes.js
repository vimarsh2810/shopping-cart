const express = require('express');

const adminController = require('../controllers/admin.controller.js');
const { checkAdmin, checkSuperAdmin } = require('../middlewares/checkRole.js');
const { validateToken } = require('../middlewares/validateToken.js');
const { upload } = require('../middlewares/uploadImage.js');
const { categoryValidator, signupValidator, validate } = require('../middlewares/validator.js');

const router = express.Router();

router.get('/category/:id', [validateToken, checkAdmin], adminController.getCategoryById);

router.post('/category', [validateToken, checkAdmin, categoryValidator(), validate], adminController.addCategory);

router.put('/category/:id', [validateToken, checkAdmin, categoryValidator(), validate], adminController.editCategory);

router.delete('/category/:id', [validateToken, checkAdmin], adminController.deleteCategory);

router.get('/categories', [validateToken, checkAdmin], adminController.getAllCategories);

router.get('/limitedCategories', [validateToken, checkAdmin], adminController.getLimitedCategories);

router.post('/product', [validateToken, checkAdmin, upload.single("file")], adminController.addProduct);

router.put('/product/:id', [validateToken, checkAdmin], adminController.editProduct);

router.delete('/product/:id', [validateToken, checkAdmin], adminController.deleteProduct);

router.get('/product/:id', [validateToken, checkAdmin], adminController.getProductById);

router.post('/subAdmin', [validateToken, checkSuperAdmin, signupValidator(), validate], adminController.addSubAdmin);

router.get('/subAdmin/:id', [validateToken, checkSuperAdmin], adminController.getSubAdmin);

router.get('/subAdmins', [validateToken, checkSuperAdmin], adminController.getAllSubAdmins);

router.put('/subAdmin/:id', [validateToken, checkSuperAdmin, signupValidator(), validate], adminController.editSubAdmin);

router.put('/profile', [validateToken, checkAdmin], adminController.editProfile);

router.get('/orders', [validateToken, checkAdmin], adminController.getAllOrders);

router.get('/order/:id', [validateToken, checkAdmin], adminController.getOrderById);

module.exports = router;