const { order, OrderItem } = require('../database/models');

class OrderRepository {
    async createOrder(orderData, transaction) {
        return await order.create(orderData, { transaction });
    }

    async createOrderItems(items, transaction) {
        return await OrderItem.bulkCreate(items, { transaction });
    }

      async getAllOrders() {
    return order.findAll({
      include: [{ model: OrderItem, as: "items" }],
      order: [["createdAt", "DESC"]],
    });
  }

  async getOrderById(id) {
    return order.findByPk(id, { include: [{ model: OrderItem, as: "items" }] });
  }

  async updateOrderStatus(id, status) {
    const orderData = await order.findByPk(id);
    if (!orderData) return null;
    orderData.orderStatus = status;
    await orderData.save();
    return orderData;
  }
}

module.exports = new OrderRepository();