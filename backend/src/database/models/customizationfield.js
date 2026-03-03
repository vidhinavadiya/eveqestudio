'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CustomizationField extends Model {
    static associate(models) {
      CustomizationField.belongsTo(models.CustomizationGroup, {
        foreignKey: 'groupId',
        as: 'group'   // or 'customizationGroup' — both fine, just not 'fields'
      });
    }
  }

  CustomizationField.init(
    {
      id: { 
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
      },
      groupId: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
      },
      label: { 
        type: DataTypes.STRING, 
        allowNull: false 
      },
      fieldType: { 
        type: DataTypes.STRING, 
        allowNull: false 
      },
      isRequired: { 
        type: DataTypes.BOOLEAN, 
        defaultValue: true 
      },
      sortOrder: { 
        type: DataTypes.INTEGER, 
        defaultValue: 1 
      },
      allowedValues: { 
        type: DataTypes.TEXT, 
        allowNull: true 
      },
      minLength: { 
        type: DataTypes.INTEGER, 
        allowNull: true 
      },
      maxLength: { 
        type: DataTypes.INTEGER, 
        allowNull: true 
      }
    },
    {
      sequelize,
      modelName: 'CustomizationField',
      tableName: 'customizationFields',
      timestamps: true
    }
  );

  return CustomizationField;
};