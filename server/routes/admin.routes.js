const express = require('express');

const adminController = require('../controllers/admin.controller.js');
const { checkAdmin, checkSuperAdmin } = require('../middlewares/checkRole.js');
const { validateToken } = require('../middlewares/validateToken.js');
const { upload } = require('../middlewares/uploadImage.js');

const router = express.Router();

router.post('/category/add', [validateToken, checkAdmin], adminController.addCategory);

router.post('/product/add', [validateToken, checkAdmin, upload.single("file")], adminController.addProduct);

router.post('/subAdmin/add', [validateToken, checkSuperAdmin], adminController.addSubAdmin);

router.get('/categories', [validateToken, checkSuperAdmin], adminController.getAllCategories);

module.exports = router;