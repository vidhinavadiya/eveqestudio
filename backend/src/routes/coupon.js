const express = require('express');
const router = express.Router();
const couponController = require('../controllers/coupon.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// 🔥 middleware CALL karna zaruri hai
router.post('/apply', authMiddleware(['customer']), couponController.applyCoupon);
router.post('/remove', authMiddleware(['customer']), couponController.removeCoupon);
router.get('/available', authMiddleware(['customer']), couponController.getAllCoupons);

router.post('/create', authMiddleware(['admin']), couponController.createCoupon);

router.put('/update/:id', authMiddleware(['admin']), couponController.updateCoupon);

router.delete('/delete/:id', authMiddleware(['admin']), couponController.deleteCoupon);

router.get('/all', couponController.getAllCoupons);

module.exports = router;
