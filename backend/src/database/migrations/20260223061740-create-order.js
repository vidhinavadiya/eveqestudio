'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      orderNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',   // table name
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      //address
      firstName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false
      },
      addressLine1: {
        type: Sequelize.STRING,
        allowNull: false
      },
      addressLine2: {
        type: Sequelize.STRING,
        allowNull: false
      },
      landmark: {
        type: Sequelize.STRING,
        allowNull: true
      },
      city: {
        type: Sequelize.STRING,
        allowNull: false
      },
      state: {
        type: Sequelize.STRING,
        allowNull: false
      },
      country: {
        type: Sequelize.STRING,
        allowNull: false
      },
      pincode: {
        type: Sequelize.STRING,
        allowNull: false
      },
      // Pricing
      subtotal: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: false
      },
      shippingCharge: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: false,
        defaultValue: 0
      },
      codCharge: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: false,
        defaultValue: 0
      },
      couponDiscount: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: false,
        defaultValue: 0
      },
      totalAmount: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: false
      },
      // Payment
      paymentMethod: {
        type: Sequelize.ENUM('prepaid', 'cod'),
        allowNull: false
      },
      paymentStatus: {
        type: Sequelize.ENUM('pending', 'paid', 'failed'),
        defaultValue: 'pending'
      },

      // Order Status
      orderStatus: {
        type: Sequelize.ENUM(
          'placed',
          'confirmed',
          'shipped',
          'delivered',
          'cancelled'
        ),
        defaultValue: 'placed'
      },
      trackingId: {
        type: Sequelize.STRING,
        allowNull:true
      },
      courierName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      placedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      shippedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null
      },
      deliveredAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('orders');
  }
};