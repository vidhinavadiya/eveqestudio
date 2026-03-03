'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProductColor extends Model {
    static associate(models) {
      ProductColor.belongsTo(models.Product, { foreignKey: 'productId', as: 'colors' });
    }
  }

  ProductColor.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      productId: { type: DataTypes.INTEGER, allowNull: false },
      colorName: { type: DataTypes.STRING, allowNull: false },
      colorCode: { type: DataTypes.STRING, allowNull: true },
      isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
    },
    {
      sequelize,
      modelName: 'ProductColor',
      tableName: 'productColors',
      timestamps: true
    }
  );

  return ProductColor;
};
