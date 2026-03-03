// const express = require('express');
// const router = express.Router();
// const reviewController = require('../controllers/review.controller');
// const AuthMiddleware = require('../middlewares/auth.middleware');

// // Create Review (Protected)
// router.post('/', AuthMiddleware(['admin','customer']), reviewController.create);

// // Get Reviews by Product (Public)
// router.get('/product/:productId', reviewController.getByProduct);

// // Update Review (Protected)
// router.put('/:id', AuthMiddleware(['admin']), reviewController.update);

// // Delete Review (Protected)
// router.delete('/:id', AuthMiddleware(['admin']), reviewController.delete);
// router.get('/', AuthMiddleware(['admin','customer']), reviewController.getAll);
// router.get('/public', reviewController.getAllPublic);
// module.exports = router;

const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');
const AuthMiddleware = require('../middlewares/auth.middleware');
const uploadReview = require('../middlewares/upload/uploadreview.middleware');

// Create Review with images (Protected: admin + customer)
router.post('/', AuthMiddleware(['admin','customer']), uploadReview, reviewController.create);

// Get Reviews by Product (Public)
router.get('/product/:productId', reviewController.getByProduct);

// Update Review (Protected: admin)
router.put('/:id', AuthMiddleware(['admin','customer']), uploadReview,reviewController.update);
// Delete Review (Protected: admin)
router.delete('/:id', AuthMiddleware(['admin']), reviewController.delete);

// Get all Reviews (Protected: admin + customer)
router.get('/', AuthMiddleware(['admin','customer']), reviewController.getAll);

// Get all Public Reviews
router.get('/public', reviewController.getAllPublic);

module.exports = router;