'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class LetterOption extends Model {
    static associate(models) {
      LetterOption.belongsTo(models.Product, { foreignKey: 'productId',as: 'letters' });
    }
  }

  LetterOption.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      productId: { type: DataTypes.INTEGER, allowNull: false },
      letter: { type: DataTypes.STRING(1), allowNull: false },
      price: { type: DataTypes.DECIMAL(10, 2), allowNull: true, defaultValue: 0 },
      isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
    },
    {
      sequelize,
      modelName: 'LetterOption',
      tableName: 'letterOptions',
      timestamps: true
    }
  );

  return LetterOption;
};
