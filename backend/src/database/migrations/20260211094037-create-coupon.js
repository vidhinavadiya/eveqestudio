'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('coupons', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      discountType: {
        type: Sequelize.ENUM('percentage', 'flat'),
        allowNull: false
      },
      discountValue: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      minorderamount: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      maxDiscountAmount: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      isFirstOrderOnly: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      usageLimit: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      usedCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      expiryDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
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
    await queryInterface.dropTable('coupons');
  }
};