'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      // Product से सीधे जुड़े relations ही यहाँ रखो

      Product.hasMany(models.ProductImage, {
        as: 'images',
        foreignKey: 'productId',
        onDelete: 'CASCADE'
      });

      Product.hasMany(models.ProductColor, {
        as: 'colors',
        foreignKey: 'productId',
        onDelete: 'CASCADE'
      });

      Product.hasMany(models.ProductSize, {
        as: 'sizes',
        foreignKey: 'productId',
        onDelete: 'CASCADE'
      });

      Product.hasMany(models.ProductKeyPoint, {
        as: 'keyPoints',
        foreignKey: 'productId',
        onDelete: 'CASCADE'
      });

      Product.hasMany(models.LetterOption, {
        as: 'letters',
        foreignKey: 'productId',
        onDelete: 'CASCADE'
      });

      Product.hasMany(models.CustomizationGroup, {
        as: 'customizationGroups',
        foreignKey: 'productId',
        onDelete: 'CASCADE'
      });

      // ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
      // नीचे वाली लाइन हटा दो — ये CustomizationGroup के अंदर पहले से define है
      // models.CustomizationGroup.hasMany(models.CustomizationField, ...);
      // ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

      // reverse belongsTo — ये ठीक हैं, इन्हें रख सकते हो (optional लेकिन अच्छा)
      models.ProductImage.belongsTo(models.Product, { foreignKey: 'productId' });
      models.ProductColor.belongsTo(models.Product, { foreignKey: 'productId' });
      models.ProductSize.belongsTo(models.Product, { foreignKey: 'productId' });
      models.ProductKeyPoint.belongsTo(models.Product, { foreignKey: 'productId' });
      models.LetterOption.belongsTo(models.Product, { foreignKey: 'productId' });
      models.CustomizationGroup.belongsTo(models.Product, { foreignKey: 'productId' });

      // CustomizationField का belongsTo यहाँ मत डालो — वो CustomizationField model में define होना चाहिए
      // models.CustomizationField.belongsTo(models.CustomizationGroup, { foreignKey: 'groupId' });
    }
  }

  Product.init({
    productId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    productName:        DataTypes.STRING,
    productTitle:       DataTypes.STRING,
    categoryId:         DataTypes.INTEGER,
    subcategoryId:      DataTypes.INTEGER,
    sku:                DataTypes.STRING,
    mrp:                DataTypes.DECIMAL(10, 2),
    sellingPrice:       DataTypes.DECIMAL(10, 2),
    discountPrice:      DataTypes.DECIMAL(10, 2),
    stockQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0
        }
  },
    status:             DataTypes.ENUM('active', 'inactive'),
    shortDescription:   DataTypes.TEXT,
    productDescription: DataTypes.TEXT,
    length:             DataTypes.FLOAT,
    width:              DataTypes.FLOAT,
    height:             DataTypes.FLOAT,
    weight:             DataTypes.FLOAT,
    manufacturerName:   DataTypes.STRING,
    countryOfOrigin:    DataTypes.STRING,
    netQuantity:        DataTypes.STRING,
    material:           DataTypes.STRING,
    printingTime:       DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
    timestamps: true
  });

  return Product;
};