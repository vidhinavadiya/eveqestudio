const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/checkout', authMiddleware(['customer']), orderController.processCheckout);
router.post('/payment/verify', authMiddleware(['customer']), orderController.verifyPayment);
router.get('/my-orders', authMiddleware(['customer']), orderController.getMyOrders);


router.get("/orders", authMiddleware(["admin"]), orderController.getAllOrders);
router.patch("/orders/:id/status", authMiddleware(["admin"]), orderController.updateStatus);

module.exports = router;