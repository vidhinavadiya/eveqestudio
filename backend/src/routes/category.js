// routes/category.route.js
const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/category.controller');
const AuthMiddleware = require('../middlewares/auth.middleware');
const uploadMiddleware = require('../middlewares/upload/uploadcategory.middleware');

// ✅ PUBLIC (CUSTOMER / HOME PAGE)
router.get('/public', CategoryController.getAllCategories);

// ✅ ADMIN + SELLER
router.post(
  '/',
  AuthMiddleware(['admin', 'seller']),
  uploadMiddleware.single('categoryImage'),
  CategoryController.createCategory
);

router.put(
  '/:id',
  AuthMiddleware(['admin', 'seller']),
  uploadMiddleware.single('categoryImage'),
  CategoryController.updateCategory
);

router.delete(
  '/:id',
  AuthMiddleware(['admin', 'seller']),
  CategoryController.deleteCategory
);

// ✅ ADMIN + SELLER (single category)
router.get(
  '/:id',
  AuthMiddleware(['admin', 'seller']),
  CategoryController.getCategoryById
);

// ✅ ADMIN + SELLER + CUSTOMER (dashboard, admin panel)
router.get(
  '/',
  AuthMiddleware(['admin', 'seller', 'customer']),
  CategoryController.getAllCategories
);

module.exports = router;
