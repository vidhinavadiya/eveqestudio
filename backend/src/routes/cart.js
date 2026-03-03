const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/add', authMiddleware(['customer']), cartController.addToCart);
router.put('/update-quantity', authMiddleware(['customer']), cartController.updateQuantity);
router.delete('/remove-item', authMiddleware(['customer']), cartController.removeItem);
router.get('/', authMiddleware(['customer']), cartController.getCart);

module.exports = router;
