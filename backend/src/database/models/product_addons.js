'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProductAddon extends Model {
    static associate(models) {
      // ProductAddon belongs to a Product
      ProductAddon.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
      // ProductAddon has many Support Links
      ProductAddon.hasMany(models.AddonSupportLink, { foreignKey: 'addonId', as: 'supportLinks' });
      // ProductAddon has many Points
      ProductAddon.hasMany(models.AddonPoint, { foreignKey: 'addonId', as: 'points' });
    }
  }

  ProductAddon.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'ProductAddon',
    tableName: 'product_addons',
    timestamps: true
  });

  return ProductAddon;
};