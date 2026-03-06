// // const orderService = require('../services/order.service');

// // class OrderController {
// //     processCheckout = async (req, res) => {
// //         try {
// //             const userId = req.user.id; 
// //             const orderData = await orderService.checkout(userId, req.body);
            
// //             return res.status(201).json({
// //                 success: true,
// //                 message: "Order placed successfully!",
// //                 data: orderData // Isme ab address, items, aur calculations sab dikhega
// //             });
// //         } catch (error) {
// //             console.error("Checkout Error:", error.message);
// //             return res.status(400).json({
// //                 success: false,
// //                 message: error.message
// //             });
// //         }
// //     }
// // }

// // module.exports = new OrderController();

// const orderService = require('../services/order.service'); // Isse uncomment karein
// const paymentService = require('../services/payment.service');

// class OrderController {

//     processCheckout = async (req, res) => {
//         try {
//             const userId = req.user.id;
//             const orderData = await orderService.checkout(userId, req.body);

//             if (orderData.paymentMethod === 'prepaid') {
//                 // Create payment gateway order
//                 const razorpayOrder = await paymentService.createRazorpayOrder(orderData.id, orderData.totalAmount);

//                 return res.status(201).json({
//                     success: true,
//                     message: "Order placed successfully! Proceed to payment",
//                     data: {
//                         orderId: orderData.id,
//                         totalAmount: orderData.totalAmount,
//                         razorpayOrder
//                     }
//                 });
//             }

//             // COD flow
//             return res.status(201).json({
//                 success: true,
//                 message: "Order placed successfully! COD selected",
//                 data: orderData
//             });

//         } catch (error) {
//             console.error("Checkout Error:", error.message);
//             return res.status(400).json({
//                 success: false,
//                 message: error.message
//             });
//         }
//     }

//     // Payment verification callback
// // order.controller.js ke andar verifyPayment update karein
// verifyPayment = async (req, res) => {
//     try {
//         const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

//         const isValid = await paymentService.verifyPayment({
//             razorpay_order_id,
//             razorpay_payment_id,
//             razorpay_signature
//         });

//         if (!isValid) throw new Error("Payment verification failed");

//         // Service se update karwayein ya sahi model use karein
//         const { order } = require('../database/models'); // Yahan model ensure karein
//         const orderData = await order.findByPk(orderId);
        
//         if (!orderData) throw new Error("Order not found in database");

//         orderData.paymentStatus = 'paid';
//         orderData.orderStatus = 'confirmed';
//         await orderData.save();

//         return res.json({ 
//             success: true, 
//             message: "Payment successful", 
//             data: orderData 
//         });

//     } catch (error) {
//         console.error("Verification Error:", error.message);
//         return res.status(400).json({ success: false, message: error.message });
//     }
// }


// // order.controller.js ke andar add karein
// getMyOrders = async (req, res) => {
//     try {
//         const userId = req.user.id;
//         const { order, OrderItem } = require('../database/models');

//         const orders = await order.findAll({
//             where: { userId: userId },
//             include: [{ model: OrderItem, as: 'items' }],
//             order: [['createdAt', 'DESC']] // Latest orders pehle dikhenge
//         });

//         return res.json({
//             success: true,
//             data: orders
//         });
//     } catch (error) {
//         return res.status(400).json({ success: false, message: error.message });
//     }
// }

// }

// module.exports = new OrderController();


const orderService = require('../services/order.service');
const paymentService = require('../services/payment.service');
const sendOrderConfirmation = require('../utils/orderEmail');
const sendWhatsAppOrderMsg = require('../utils/whatsapp');

class OrderController {
    //create order
    processCheckout = async (req, res) => {
        try {
            const userId = req.user.id;
            const orderData = await orderService.checkout(userId, req.body);
            if (orderData.paymentMethod === 'prepaid') {
                const razorpayOrder = await paymentService.createRazorpayOrder(orderData.id, orderData.totalAmount);
                return res.status(201).json({
                    success: true,
                    message: "Order placed successfully! Proceed to payment",
                    data: {
                        orderId: orderData.id,
                        totalAmount: orderData.totalAmount,
                        razorpayOrder
                    }
                });
            }
            //COD Flow
            try {
                // Check karein ki email/phone null toh nahi hain
                if (orderData.email) {
                    await sendOrderConfirmation(orderData.email, orderData);
                }
                if (orderData.phone) {
                    await sendWhatsAppOrderMsg(orderData.phone, orderData);
                }
            } catch (mailError) {
                console.error("Notification Error (COD):", mailError.message);
            }
            return res.status(201).json({
                success: true,
                message: "Order placed successfully! COD selected",
                data: orderData
            });
        } catch (error) {
            console.error("Checkout Error:", error.message);
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
    //verify payment
    verifyPayment = async (req, res) => {
        try {
            const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;
            const isValid = await paymentService.verifyPayment({
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature
            });
            if (!isValid) throw new Error("Payment verification failed");
            const db = require('../database/models'); 
            const OrderModel = db.order; 
            const orderData = await OrderModel.findByPk(orderId);
            if (!orderData) throw new Error("Order not found in database");
            orderData.paymentStatus = 'paid';
            orderData.orderStatus = 'confirmed';
            await orderData.save();
            try {
                if (orderData.email) await sendOrderConfirmation(orderData.email, orderData);
                if (orderData.phone) await sendWhatsAppOrderMsg(orderData.phone, orderData);
            } catch (mailError) {
                console.error("Notification Error (Prepaid):", mailError.message);
            }
            return res.json({ 
                success: true, 
                message: "Payment successful", 
                data: orderData 
            });
        } catch (error) {
            console.error("Verification Error:", error.message);
            return res.status(400).json({ success: false, message: error.message });
        }
    }
    //gey my order
    getMyOrders = async (req, res) => {
        try {
            const userId = req.user.id;
            const { order, OrderItem } = require('../database/models');
            const orders = await order.findAll({
                where: { userId: userId },
                include: [{ model: OrderItem, as: 'items' }],
                order: [['createdAt', 'DESC']]
            });
            return res.json({
                success: true,
                data: orders
            });
        } catch (error) {
            return res.status(400).json({ 
                success: false, 
                message: error.message 
            });
        }
    }
    //get all order
    async getAllOrders(req, res) {
    try {
      const orders = await orderService.fetchAllOrders();
      res.json({ 
        success: true, 
        data: orders 
    });
    } catch (err) {
      console.error(err);
      res.status(500).json({ 
        success: false, 
        message: "Server Error" 
    });
    }
  }
  //update status
  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updatedOrder = await orderService.changeOrderStatus(id, status);
      res.json({ 
        success: true, 
        message: "Status updated", 
        data: updatedOrder 
    });
    } catch (err) {
      console.error(err);
      res.status(500).json({ 
        success: false, 
        message: err.message || "Server Error" 
    });
    }
  }
}

module.exports = new OrderController();