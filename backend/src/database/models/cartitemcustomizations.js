'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class cartitemcustomizations extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    cartitemcustomizations.belongsTo(models.cartitem, {
      foreignKey: 'cartItemId',
      as: 'cartItem'
    });
    }
  }
  cartitemcustomizations.init({
    cartItemId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    groupName: {
      type: DataTypes.STRING,
      allowNull: false
    },

    fieldLabel: {
      type: DataTypes.STRING,
      allowNull: false
    },

    userValue: {
      type: DataTypes.STRING,
      allowNull: false
    }

  }, {
    sequelize,
    modelName: 'cartitemcustomizations',
    tableName: 'cartitemcustomizations',
    timestamps: true
  });
  return cartitemcustomizations;
};