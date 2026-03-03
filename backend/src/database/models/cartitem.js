'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class cartitem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    cartitem.belongsTo(models.cart, {
        foreignKey: 'cartId',
        as: 'cart'
    });

    cartitem.hasMany(models.cartitemcustomizations, {
      foreignKey: 'cartItemId',
      as: 'customizations',
      onDelete: 'CASCADE'
    });

    cartitem.belongsTo(models.Product, {
      foreignKey: 'productId',
      as: 'product'
    });

    }
  }
  cartitem.init({

    cartId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    productId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    productName: {
      type: DataTypes.STRING,
      allowNull: false
    },

    basePrice: {
      type: DataTypes.FLOAT,
      allowNull: false
    },

    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    selectedColor: {
      type: DataTypes.STRING,
      allowNull: true
    },

    selectedSize: {
      type: DataTypes.STRING,
      allowNull: true
    },

    selectedLetters: {
      type: DataTypes.JSON,
      allowNull: true
    },

    customizationPrice: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },

    itemTotal: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    productImage: {
      type: DataTypes.STRING, 
      allowNull: true,
      defaultValue: null
    },
    isFreeItem: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }

  }, {
    sequelize,
    modelName: 'cartitem',
    tableName: 'cartitems',
    timestamps: true
  });
  return cartitem;
};