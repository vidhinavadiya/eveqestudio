'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class faq extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  faq.init({
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
    question: {
      type: DataTypes.STRING(500),
      allowNull: false
    },

    answer: {
      type: DataTypes.TEXT,
      allowNull: false
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
    }, {
    sequelize,
    modelName: 'FAQ',
    tableName: 'faqs',
    timestamps: true
  });
  return faq;
};