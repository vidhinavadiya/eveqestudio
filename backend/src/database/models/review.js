'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
static associate(models) {
  Review.belongsTo(models.user, {   // 👈 small u
    foreignKey: 'userId',
    as: 'user'
  });

  Review.belongsTo(models.Product, {  // 👈 Product correct hai (capital)
    foreignKey: 'productId',
    as: 'product'
  });
 Review.hasMany(models.ReviewImage, {
  foreignKey: 'reviewId',
  as: 'images',
  onDelete: 'CASCADE'
});
}
  }

  Review.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    comment: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Review',   // ✅ Capital
    tableName: 'reviews',
    timestamps: true
  });

  return Review;
};