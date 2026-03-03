'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
            // Order belongs to User
      order.belongsTo(models.user, {
        foreignKey: 'userId',
        as: 'user'
      });

      // Order has many OrderItems
      order.hasMany(models.OrderItem, {
        foreignKey: 'orderId',
        as: 'items'
      });
    }
  }
  order.init({
    orderNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    // Address
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    addressLine1: DataTypes.STRING,
    addressLine2: DataTypes.STRING,
    landmark: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    country: DataTypes.STRING,
    pincode: DataTypes.STRING,

    // Pricing
    subtotal: DataTypes.DECIMAL(10,2),
    shippingCharge: DataTypes.DECIMAL(10,2),
    codCharge: DataTypes.DECIMAL(10,2),
    couponDiscount: DataTypes.DECIMAL(10,2),
    totalAmount: DataTypes.DECIMAL(10,2),

    // Payment
    paymentMethod: DataTypes.ENUM('prepaid','cod'),
    paymentStatus: DataTypes.ENUM('pending','paid','failed'),

    // Order Status
    orderStatus: DataTypes.ENUM(
      'placed',
      'confirmed',
      'shipped',
      'delivered',
      'cancelled'
    ),

    placedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'order',
    tableName: 'orders',
    timestamps: true
  });
  return order;
};