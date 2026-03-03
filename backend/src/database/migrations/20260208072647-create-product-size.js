'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('productSizes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'products', key: 'productId' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },

      sizeName: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Example: S, M, L, XL'
      },

      sizeValue: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Optional numeric value or dimension'
      },

      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },

      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },

      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('productSizes');
  }
};