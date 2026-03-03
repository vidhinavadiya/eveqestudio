'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ReviewImage extends Model {
    static associate(models) {
      ReviewImage.belongsTo(models.Review, {
        foreignKey: 'reviewId',
        as: 'review',
        onDelete: 'CASCADE'
      });
    }
  }

  ReviewImage.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    reviewId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'reviews',   // ⚠ lowercase table name
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    fileUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'ReviewImage',   // ✅ FIXED
    tableName: 'reviewimages',
    timestamps: true
  });

  return ReviewImage;
};