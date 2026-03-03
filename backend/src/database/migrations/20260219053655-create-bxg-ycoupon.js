'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('BXGYcoupons', {
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
      description: {
        type: Sequelize.STRING,
        allowNull: true
      },
      active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      buyProductIds: {
        type: Sequelize.JSON,
        allowNull: false
      },
      buyQuantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      freeProductIds: {
        type: Sequelize.JSON,
        allowNull: false
      },
      freeQuantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      maxUsagePerUser: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 1
      },
      maxTotalUsage: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0 // 0 = unlimited
      },
      usedCount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
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
    await queryInterface.dropTable('BXGYcoupons');
  }
};