const express = require('express');
const router = express.Router();
const ProductAddonController = require('../controllers/productAddon.controller');
const AuthMiddleware = require('../middlewares/auth.middleware');
const uploadMiddleware = require('../middlewares/upload/uploadProductAddon.middleware');

// ✅ PUBLIC: List all product addons with support links & points
router.get('/public', ProductAddonController.getAll);

// ✅ ADMIN + SELLER: Create ProductAddon with nested support links & points
router.post(
  '/',
  AuthMiddleware(['admin', 'seller']),
  uploadMiddleware.single('image'), // expects field name "image"
  ProductAddonController.create
);

// ✅ ADMIN + SELLER: Update ProductAddon
router.put(
  '/:id',
  AuthMiddleware(['admin', 'seller']),
  uploadMiddleware.single('image'),
  ProductAddonController.update
);

// ✅ ADMIN + SELLER: Delete ProductAddon
router.delete(
  '/:id',
  AuthMiddleware(['admin', 'seller']),
  ProductAddonController.delete
);

// ✅ ADMIN + SELLER: Get single ProductAddon
router.get(
  '/:id',
  AuthMiddleware(['admin', 'seller']),
  ProductAddonController.getById
);

module.exports = router;