'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class coupon extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      coupon.hasMany(models.couponusage, {
        foreignKey: 'couponId',
        as: 'usages'
    });

    }
  }
  coupon.init({
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },

    discountType: {
      type: DataTypes.ENUM('percentage', 'flat'),
      allowNull: false
    },

    discountValue: {
      type: DataTypes.FLOAT,
      allowNull: false
    },

    minorderamount: {
    type: DataTypes.FLOAT,
  },

    maxDiscountAmount: DataTypes.FLOAT,

    isFirstOrderOnly: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },

    usageLimit: DataTypes.INTEGER,

    usedCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },

    expiryDate: DataTypes.DATE,

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }

  }, {
    sequelize,
    modelName: 'coupon',
    tableName: 'coupons',
    timestamps: true
  });
  return coupon;
};