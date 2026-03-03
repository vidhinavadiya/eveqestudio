'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BXGYcoupon extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  BXGYcoupon.init({
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false
      },
      buyProductIds: {
        type: DataTypes.JSON,
        allowNull: false
      },
      buyQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      freeProductIds: {
        type: DataTypes.JSON,
        allowNull: false
      },
      freeQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      maxUsagePerUser: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1
      },
      maxTotalUsage: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0 // 0 = unlimited
      },
      usedCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
  }, {
    sequelize,
    modelName: 'BXGYcoupon',
    tableName: 'bxgycoupons',
    timestamps: true
  });
  return BXGYcoupon;
};