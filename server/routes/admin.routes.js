const express = require('express');

const adminController = require('../controllers/admin.controller.js');
const { checkAdmin, checkSuperAdmin } = require('../middlewares/checkRole.js');
const { validateToken } = require('../middlewares/validateToken.js');

const router = express.Router();

router.post('/category/add', [validateToken, checkAdmin], adminController.addCategory);

router.post('/product/add', [validateToken, checkAdmin], adminController.addProduct);

router.post('/subAdmin/add', [validateToken, checkSuperAdmin], adminController.addSubAdmin);

module.exports = router;