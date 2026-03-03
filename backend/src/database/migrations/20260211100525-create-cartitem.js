'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cartitems', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      cartId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'carts',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },

      productId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },

      productName: {
        type: Sequelize.STRING,
        allowNull: false
      },

      basePrice: {
        type: Sequelize.FLOAT,
        allowNull: false
      },

      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
      },

      selectedColor: {
        type: Sequelize.STRING,
        allowNull: true
      },

      selectedSize: {
        type: Sequelize.STRING,
        allowNull: true
      },

      selectedLetters: {
        type: Sequelize.JSON,
        allowNull: true
      },

      customizationPrice: {
        type: Sequelize.FLOAT,
        defaultValue: 0
      },

      itemTotal: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      productImage: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      },
      isFreeItem: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
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
    await queryInterface.dropTable('cartitems');
  }
};