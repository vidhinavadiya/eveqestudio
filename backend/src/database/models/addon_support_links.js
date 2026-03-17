'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AddonSupportLink extends Model {
    static associate(models) {
      // Each support link belongs to a ProductAddon
      AddonSupportLink.belongsTo(models.ProductAddon, { foreignKey: 'addonId', as: 'addon' });
    }
  }

  AddonSupportLink.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    addonId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING
    },
    link: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'AddonSupportLink',
    tableName: 'addon_support_links',
    timestamps: true
  });

  return AddonSupportLink;
};