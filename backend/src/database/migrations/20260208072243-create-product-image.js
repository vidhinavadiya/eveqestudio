'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('productImages', {
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
      fileUrl: {
        type: Sequelize.STRING,
        allowNull: false
      },
      fileType: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'image', // 'image' ya 'video'
        comment: 'Specify file type'
      },
      isPrimary: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
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
    await queryInterface.dropTable('productImages');
  }
};