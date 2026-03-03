const Razorpay = require('razorpay');
const { order } = require('../database/models');
const config = require('../database/config/razorpay');

class PaymentService {
    constructor() {
        this.instance = new Razorpay({
            key_id: config.key_id,
            key_secret: config.key_secret
        });
    }

    async createRazorpayOrder(orderId, amount) {
        // amount in paise
        const options = {
            amount: Math.round(amount * 100), 
            currency: "INR",
            receipt: `order_rcpt_${orderId}`
        };

        const response = await this.instance.orders.create(options);
        return response;
    }

    async verifyPayment(paymentData) {
        // Verify signature to confirm payment is genuine
        const crypto = require('crypto');
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentData;

        const hmac = crypto.createHmac('sha256', config.key_secret);
        hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
        const generatedSignature = hmac.digest('hex');

        return generatedSignature === razorpay_signature;
    }
}

module.exports = new PaymentService();