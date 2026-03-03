'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
      productId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      productName: {
        type: Sequelize.STRING,
        allowNull: false
      },

      productTitle: {
        type: Sequelize.STRING,
        allowNull: true
      },

      categoryId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },

      subcategoryId: {
        type: Sequelize.INTEGER,
        allowNull: true
      },

      sku: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },

      mrp: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },

      sellingPrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },

      discountPrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },

      stockQuantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Available stock quantity (e.g., 100, 50, 0)'
      },

      status: {
        type: Sequelize.ENUM('active', 'inactive'),
        defaultValue: 'active'
      },

      shortDescription: {
        type: Sequelize.TEXT,
        allowNull: true
      },

      productDescription: {
        type: Sequelize.TEXT,
        allowNull: true
      },

      length: {
        type: Sequelize.FLOAT,
        allowNull: true
      },

      width: {
        type: Sequelize.FLOAT,
        allowNull: true
      },

      height: {
        type: Sequelize.FLOAT,
        allowNull: true
      },

      weight: {
        type: Sequelize.FLOAT,
        allowNull: true
      },

      manufacturerName: {
        type: Sequelize.STRING,
        allowNull: true
      },

      countryOfOrigin: {
        type: Sequelize.STRING,
        allowNull: true
      },

      netQuantity: {
        type: Sequelize.STRING,
        allowNull: true
      },

      material: {
        type: Sequelize.STRING,
        allowNull: true
      },

      printingTime: {
        type: Sequelize.STRING,
        allowNull: true
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
    await queryInterface.dropTable('products');
  }
};