const express = require('express');

const adminController = require('../controllers/admin.controller.js');
const { checkAdmin, checkSuperAdmin } = require('../middlewares/checkRole.js');
const { validateToken } = require('../middlewares/validateToken.js');
const { upload } = require('../middlewares/uploadImage.js');
const { categoryValidator, validate } = require('../middlewares/validator.js');

const router = express.Router();

router.post('/category', [validateToken, checkAdmin, categoryValidator(), validate], adminController.addCategory);

router.post('/product', [validateToken, checkAdmin, upload.single("file")], adminController.addProduct);

router.post('/subAdmin', [validateToken, checkSuperAdmin], adminController.addSubAdmin);

router.get('/categories', [validateToken, checkSuperAdmin], adminController.getAllCategories);

module.exports = router;