'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {  
          isEmail: true
        }
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      role: {
        type: Sequelize.ENUM('customer','seller','admin'),
        allowNull: false,
        defaultValue: 'customer'
      },
      phone: { 
        type: Sequelize.STRING, 
        allowNull: true 
      },
      address: { 
        type: Sequelize.TEXT, 
        allowNull: true 
      },
      city: { 
        type: Sequelize.STRING, 
        allowNull: true 
      },
      state: { 
        type: Sequelize.STRING, 
        allowNull: true 
      },
      pincode: { 
        type: Sequelize.STRING, 
        allowNull: true 
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};