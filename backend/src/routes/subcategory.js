const express = require('express');
const router = express.Router();
const SubcategoryController = require('../controllers/subcategory.controller');
const AuthMiddleware = require('../middlewares/auth.middleware');
const uploadMiddleware = require('../middlewares/upload/uploadsubcategory.middleware');

// 🔹 PUBLIC — only active
router.get('/public', SubcategoryController.getPublicSubcategories);

// 🔹 ADMIN — all
router.get('/', AuthMiddleware(['admin']), SubcategoryController.getAllSubcategories);

// 🔹 ADMIN + SELLER — CRUD
router.post(
  '/',
  AuthMiddleware(['admin', 'seller']),
  uploadMiddleware.single('subCategoryImage'),
  SubcategoryController.createSubcategory
);

router.put(
  '/:id',
  AuthMiddleware(['admin', 'seller']),
  uploadMiddleware.single('subCategoryImage'),
  SubcategoryController.updateSubcategory
);

router.delete(
  '/:id',
  AuthMiddleware(['admin', 'seller']),
  SubcategoryController.deleteSubcategory
);

// 🔹 SINGLE SUBCATEGORY — ADMIN + SELLER
router.get('/:id', AuthMiddleware(['admin', 'seller']), SubcategoryController.getSubcategoryById);

module.exports = router;
