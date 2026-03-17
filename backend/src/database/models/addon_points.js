'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AddonPoint extends Model {
    static associate(models) {
      // Each point belongs to a ProductAddon
      AddonPoint.belongsTo(models.ProductAddon, { foreignKey: 'addonId', as: 'addon' });
    }
  }

  AddonPoint.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    addonId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    point: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'AddonPoint',
    tableName: 'addon_points',
    timestamps: true
  });

  return AddonPoint;
};