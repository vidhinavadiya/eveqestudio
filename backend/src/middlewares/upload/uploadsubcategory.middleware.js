// uploadSubcategory.js
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const subcategoryPath = path.join(__dirname, '../../uploads/subcategories');

const storageSubcategory = multer.diskStorage({
  destination: (req, file, cb) => cb(null, subcategoryPath),
  filename: (req, file, cb) => cb(null, uuidv4() + path.extname(file.originalname)),
});

const uploadSubcategoryImage = multer({
  storage: storageSubcategory,
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    cb(ext && mime ? null : new Error('Only image files are allowed'), true);
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = uploadSubcategoryImage;
