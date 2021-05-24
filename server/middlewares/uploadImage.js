const multer = require('multer');

const path = require('path');


const storageEngine = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/img/products/');
  },
  filename: function(req, file, cb) {
    const fileName = file.originalname.split('.')[0] + '-' + new Date().toISOString().split('T')[0] + '.jpg';
    req.fileName = fileName;
    cb(null, fileName);
  }
});

const upload = multer({ storage: storageEngine });

module.exports = { upload };