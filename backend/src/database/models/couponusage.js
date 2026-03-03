'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class couponusage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      couponusage.belongsTo(models.coupon, {
        foreignKey: 'couponId',
        as: 'coupon'
    });
    }
  }
  couponusage.init({
    couponId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    orderId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'couponusage',
    tableName: 'couponusages',
    timestamps: true
  });
  return couponusage;
};