const axios = require('axios');

const sendWhatsAppOrderMsg = async (phone, orderData) => {
    try {
        // Phone number check: Agar +91 nahi hai toh add karein
        const formattedPhone = phone.startsWith('91') ? `+${phone}` : `+91${phone}`;

        const message = `📦 *Order Confirmed!*\n\n` +
                        `Hello *${orderData.firstName}*,\n` +
                        `Your order *#${orderData.orderNumber}* has been placed successfully.\n\n` +
                        `💰 *Total:* ₹${orderData.totalAmount}\n` +
                        `📍 *Shipping to:* ${orderData.city}, ${orderData.state}\n\n` +
                        `Thank you for shopping with *3D Printer Hub*! 🚀`;

        const data = {
            token: process.env.WHATSAPP_TOKEN,
            to: formattedPhone,
            body: message
        };

        const url = `https://api.ultramsg.com/${process.env.WHATSAPP_INSTANCE_ID}/messages/chat`;
        
        const response = await axios.post(url, data);
        
        if (response.data.sent === "true" || response.data.success) {
            console.log("WhatsApp Message Sent successfully to:", formattedPhone);
        } else {
            console.log("WhatsApp API Response:", response.data);
        }
        
        return response.data;
    } catch (error) {
        console.error("WhatsApp Error Detail:", error.response ? error.response.data : error.message);
    }
};

module.exports = sendWhatsAppOrderMsg;