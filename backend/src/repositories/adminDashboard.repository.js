const { user, Product, order, OrderItem, sequelize } = require('../database/models');
const { fn, col, literal } = require('sequelize');

exports.getDashboardStats = async () => {
  try {
    // ✅ Total Users
    const totalUsers = await user.count();

    // ✅ Total Products
    const totalProducts = await Product.count();

    // ✅ Total Orders
    const totalOrders = await order.count();

    // ✅ Pending Orders (placed + confirmed)
    const pendingOrders = await order.count({
      where: {
        orderStatus: ['placed', 'confirmed']
      }
    });

    // ✅ Delivered Orders
    const deliveredOrders = await order.count({
      where: {
        orderStatus: 'delivered'
      }
    });

    // ✅ Total Revenue (only paid)
    const totalRevenue = await order.sum('totalAmount', {
      where: {
        paymentStatus: 'paid'
      }
    });

    // ✅ Today Orders
    const todayOrders = await order.count({
      where: sequelize.where(
        fn('DATE', col('createdAt')),
        fn('CURDATE')
      )
    });

    // ✅ Monthly Sales
    const monthlySales = await order.findAll({
      attributes: [
        [fn('MONTH', col('createdAt')), 'month'],
        [fn('SUM', col('totalAmount')), 'total']
      ],
      where: {
        paymentStatus: 'paid'
      },
      group: [fn('MONTH', col('createdAt'))],
      raw: true
    });

    // ✅ Top Selling Products
    const topProducts = await OrderItem.findAll({
      attributes: [
        'productId',
        [fn('SUM', col('quantity')), 'totalSold']
      ],
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['productName']
        }
      ],
      group: ['productId'],
      order: [[literal('totalSold'), 'DESC']],
      limit: 5,
      raw: true,
      nest: true
    });

    // ✅ Recent Orders
    const recentOrders = await order.findAll({
      attributes: ['id', 'totalAmount', 'orderStatus', 'createdAt'],
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    // ✅ Latest Users
    const latestUsers = await user.findAll({
      attributes: ['id', 'username', 'email', 'createdAt'],
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    return {
      totalUsers,
      totalProducts,
      totalOrders,
      pendingOrders,
      deliveredOrders,
      totalRevenue: totalRevenue || 0,
      todayOrders,
      monthlySales,
      topProducts,
      recentOrders,
      latestUsers
    };

  } catch (error) {
    console.error("Repository Error:", error);
    throw error;
  }
};