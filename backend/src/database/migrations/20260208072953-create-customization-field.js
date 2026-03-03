'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('customizationFields', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      groupId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'customizationGroups', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },

      label: {
        type: Sequelize.STRING,
        allowNull: false
      },

      fieldType: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'text, number, dropdown, color, checkbox, date, etc.'
      },

      isRequired: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },

      sortOrder: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },

      allowedValues: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Comma separated options or JSON for dropdown/select'
      },

      minLength: {
        type: Sequelize.INTEGER,
        allowNull: true
      },

      maxLength: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('customizationFields');
  }
};