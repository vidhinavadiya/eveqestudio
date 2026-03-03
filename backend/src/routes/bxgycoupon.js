const express = require('express');
const router = express.Router();
const BXGYCouponController = require('../controllers/bxgycoupon.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// CRUD routes
router.post('/add', authMiddleware(['admin']), BXGYCouponController.create);
router.put('/:id', authMiddleware(['admin']), BXGYCouponController.update);
router.delete('/:id', authMiddleware(['admin']), BXGYCouponController.delete);
// routes/bxgycoupon.route.js mein temporary change karein
router.get('/', BXGYCouponController.list); // Bina auth ke check karein
// Apply / Remove coupon for customer
router.post('/apply', authMiddleware(['customer']), BXGYCouponController.apply);
router.post('/remove', authMiddleware(['customer']), BXGYCouponController.remove);

module.exports = router;
