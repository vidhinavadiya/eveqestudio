'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProductSize extends Model {
    static associate(models) {
      ProductSize.belongsTo(models.Product, { foreignKey: 'productId', as: 'sizes' });
    }
  }

  ProductSize.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      productId: { type: DataTypes.INTEGER, allowNull: false },
      sizeName: { type: DataTypes.STRING, allowNull: false },
      sizeValue: { type: DataTypes.STRING, allowNull: true },
      isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
    },
    {
      sequelize,
      modelName: 'ProductSize',
      tableName: 'productSizes',
      timestamps: true
    }
  );

  return ProductSize;
};
