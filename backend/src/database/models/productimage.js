// src/database/models/productImage.js (or ProductImage.js)

'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProductImage extends Model {
    static associate(models) {
      ProductImage.belongsTo(models.Product, { 
        foreignKey: 'productId', 
        as: 'product' 
      });
    }
  }

  ProductImage.init(
    {
      id: { 
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
      },
      productId: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
      },
      fileUrl: {                  // ← changed from imageUrl → fileUrl
        type: DataTypes.STRING, 
        allowNull: false 
      },
      fileType: {                 // ← add this if you want to use it (optional but good)
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'image'
      },
      isPrimary: { 
        type: DataTypes.BOOLEAN, 
        defaultValue: false 
      }
    },
    {
      sequelize,
      modelName: 'ProductImage',
      tableName: 'productImages',
      timestamps: true
    }
  );

  return ProductImage;
};