'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProductKeyPoint extends Model {
    static associate(models) {
      ProductKeyPoint.belongsTo(models.Product, { foreignKey: 'productId', as: 'keyPoints' });
    }
  }

  ProductKeyPoint.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      productId: { type: DataTypes.INTEGER, allowNull: false },
      pointText: { type: DataTypes.STRING, allowNull: false },
      sortOrder: { type: DataTypes.INTEGER, defaultValue: 1 }
    },
    {
      sequelize,
      modelName: 'ProductKeyPoint',
      tableName: 'productKeyPoints',
      timestamps: true
    }
  );

  return ProductKeyPoint;
};
