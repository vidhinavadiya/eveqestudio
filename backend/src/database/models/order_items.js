'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class order_items extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
            // Belongs to Order
      order_items.belongsTo(models.order, {
        foreignKey: 'orderId',
        as: 'order'
      });

      // Belongs to Product (optional but recommended)
      order_items.belongsTo(models.Product, {
        foreignKey: 'productId',
        as: 'product'
      });
    }
  }
  order_items.init({
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    productName: DataTypes.STRING,
    productImage: DataTypes.STRING,
    price: DataTypes.DECIMAL(10,2),
    quantity: DataTypes.INTEGER,
    total: DataTypes.DECIMAL(10,2)
  }, {
    sequelize,
    modelName: 'OrderItem',
    tableName: 'order_items',
    timestamps: true
  });
  return order_items;
};