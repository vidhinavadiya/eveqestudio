'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CustomizationGroup extends Model {
    static associate(models) {
      CustomizationGroup.belongsTo(models.Product, {
        foreignKey: 'productId',
        as: 'customizationGroups'
      });

      CustomizationGroup.hasMany(models.CustomizationField, {
        foreignKey: 'groupId',
        as: 'fields',
        onDelete: 'CASCADE'
      });
    }
  }

  CustomizationGroup.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      productId: { type: DataTypes.INTEGER, allowNull: false },
      groupName: { type: DataTypes.STRING, allowNull: false },
      sortOrder: { type: DataTypes.INTEGER, defaultValue: 1 }
    },
    {
      sequelize,
      modelName: 'CustomizationGroup',
      tableName: 'customizationGroups',
      timestamps: true
    }
  );

  return CustomizationGroup;
};