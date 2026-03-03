const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/product.controller');
const AuthMiddleware = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload/uploadproduct.middleware');   // ← yeh line sahi hai

// ADMIN + SELLER - CREATE
router.post(
  '/',
  AuthMiddleware(['admin', 'seller']),
  upload.fields([
    { name: 'productImages', maxCount: 10 },
    { name: 'productVideos', maxCount: 5 }
  ]),
  ProductController.createProduct
);

// UPDATE
router.put(
  '/:id',
  AuthMiddleware(['admin', 'seller']),
  upload.fields([
    { name: 'productImages', maxCount: 10 },
    { name: 'productVideos', maxCount: 5 }
  ]),
  ProductController.update
);

// baaki routes same rahenge
router.get('/', AuthMiddleware(['admin', 'seller']), ProductController.getAll);
router.get('/:id', AuthMiddleware(['admin', 'seller']), ProductController.getById);
router.delete('/:id', AuthMiddleware(['admin', 'seller']), ProductController.delete);

router.get('/customer/products', ProductController.getCustomerProducts);
router.get('/customer/:id', ProductController.getCustomerProductById);
router.patch('/:id/quick-update', AuthMiddleware(['admin', 'seller']), ProductController.quickUpdateProduct);


router.get('/related/:id', ProductController.getRelatedProducts);

module.exports = router;