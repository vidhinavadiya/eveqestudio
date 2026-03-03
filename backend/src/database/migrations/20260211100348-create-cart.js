'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('carts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      userId: {
        type: Sequelize.INTEGER,
        allowNull: true
      },

      sessionId: {
        type: Sequelize.STRING,
        allowNull: true
      },

      couponId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'coupons',
          key: 'id'
        },
        onDelete: 'SET NULL'
      },

      couponDiscountAmount: {
        type: Sequelize.FLOAT,
        defaultValue: 0
      },

      shippingCharge: {
        type: Sequelize.FLOAT,
        defaultValue: 0
      },

      subtotal: {
        type: Sequelize.FLOAT,
        defaultValue: 0
      },

      totalAmount: {
        type: Sequelize.FLOAT,
        defaultValue: 0
      },

      status: {
        type: Sequelize.ENUM('active', 'ordered', 'abandoned'),
        defaultValue: 'active'
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
    await queryInterface.dropTable('carts');
  }
};