'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      cart.hasMany(models.cartitem, {
        foreignKey: 'cartId',
        as: 'items',
        onDelete: 'CASCADE'
    });

    cart.belongsTo(models.coupon, {
      foreignKey: 'couponId',
      as: 'coupon'
    });
    }
  }
  cart.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    sessionId: {
      type: DataTypes.STRING,
      allowNull: true
    },

    couponId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    couponDiscountAmount: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },

    shippingCharge: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },

    subtotal: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },

    totalAmount: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },

    status: {
      type: DataTypes.ENUM('active', 'ordered', 'abandoned'),
      defaultValue: 'active'
    }

  }, {
    sequelize,
    modelName: 'cart',
    tableName: 'carts',
    timestamps: true
  });
  return cart;
};