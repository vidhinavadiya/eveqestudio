// services/order.service.js

const { order, sequelize, Product, OrderItem } = require('../database/models');
const orderRepository = require('../repositories/order.repository');
const cartRepository = require('../repositories/cart.repository');

class OrderService {

    async checkout(userId, checkoutData) {

        const t = await sequelize.transaction();

        try {

            // 1️⃣ Get Active Cart WITH ITEMS
            const cart = await cartRepository.findActiveCart(userId);

            if (!cart || !cart.items || cart.items.length === 0) {
                throw new Error("Cart is empty");
            }

            let subtotal = 0;
            const orderItemsData = [];

            // 2️⃣ Validate + Lock + Price Fetch + Stock Reduce
            for (const item of cart.items) {

                let price = 0;
                let itemTotal = 0;

                const imageUrl = item.productImage || "default-product-image.jpg";

                // 🔹 Skip free items price
                if (!item.isFreeItem) {

                    // Quantity validation
                    if (!item.quantity || item.quantity <= 0) {
                        throw new Error("Invalid quantity in cart");
                    }

                    // 🔴 Fetch fresh product with lock
                    const product = await Product.findOne({
                        where: { productId: item.productId },
                        transaction: t,
                        lock: t.LOCK.UPDATE
                    });

                    if (!product) {
                        throw new Error("Product not found");
                    }

                    // Stock validation
                    if (product.stockQuantity < item.quantity) {
                        throw new Error(`${product.productName} is out of stock`);
                    }

                    // ✅ Always use latest price from DB
                    price = parseFloat(product.sellingPrice);
                    itemTotal = price * item.quantity;

                    subtotal += itemTotal;

                    // ✅ Reduce stock safely
                    await product.decrement('stockQuantity', {
                        by: item.quantity,
                        transaction: t
                    });
                }

                orderItemsData.push({
                    productId: item.productId,
                    productName: item.productName,
                    productImage: imageUrl,
                    price,
                    quantity: item.quantity,
                    total: itemTotal
                });
            }

            // 3️⃣ Charges
            const shipping = parseFloat(cart.shippingCharge || 0);
            const discount = parseFloat(cart.couponDiscountAmount || 0);

            let codCharge = 0;
            if (checkoutData.paymentMethod === 'cod') {
                codCharge = 30;
            }

            const totalAmount = subtotal + shipping + codCharge - discount;

            // 4️⃣ Create Order
            const newOrder = await orderRepository.createOrder({
                userId,
                orderNumber: `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`,

                // Address
                firstName: checkoutData.firstName,
                lastName: checkoutData.lastName,
                email: checkoutData.email,
                phone: checkoutData.phone,
                addressLine1: checkoutData.addressLine1,
                addressLine2: checkoutData.addressLine2,
                landmark: checkoutData.landmark,
                city: checkoutData.city,
                state: checkoutData.state,
                country: checkoutData.country,
                pincode: checkoutData.pincode,
                // Pricing
                subtotal,
                shippingCharge: shipping,
                codCharge,
                couponDiscount: discount,
                totalAmount,
                // Payment
                paymentMethod: checkoutData.paymentMethod,
                paymentStatus: 'pending',

                orderStatus: 'placed',
                placedAt: new Date()

            }, t);

            // 5️⃣ Create Order Items
            const itemsWithOrderId = orderItemsData.map(item => ({
                ...item,
                orderId: newOrder.id
            }));

            await orderRepository.createOrderItems(itemsWithOrderId, t);

            // 6️⃣ Clear Cart
            await cartRepository.clearCart(userId, t);

            // 7️⃣ Commit
            await t.commit();

            return newOrder;

        } catch (error) {

            await t.rollback();
            throw error;
        }
    }


    // 🛑 Cancel Order (Stock Restore Safe)
    async cancelOrder(orderId) {

        const t = await sequelize.transaction();

        try {

            const orderData = await order.findByPk(orderId, {
                include: [{ model: OrderItem, as: 'items' }],
                transaction: t,
                lock: t.LOCK.UPDATE
            });

            if (!orderData) {
                throw new Error("Order not found");
            }

            if (orderData.orderStatus !== 'placed') {
                throw new Error("Order cannot be cancelled");
            }

            // Restore stock
            for (const item of orderData.items) {

                if (item.price > 0) { // Ignore free items

                    await Product.increment('stockQuantity', {
                        by: item.quantity,
                        where: { productId: item.productId },
                        transaction: t
                    });
                }
            }

            orderData.orderStatus = 'cancelled';
            await orderData.save({ transaction: t });

            await t.commit();

            return orderData;

        } catch (error) {

            await t.rollback();
            throw error;
        }
    }

      async fetchAllOrders() {
    return orderRepository.getAllOrders();
  }

  async changeOrderStatus(id, status) {
    const updatedOrder = await orderRepository.updateOrderStatus(id, status);
    if (!updatedOrder) throw new Error("Order not found");
    return updatedOrder;
  }
}

module.exports = new OrderService();