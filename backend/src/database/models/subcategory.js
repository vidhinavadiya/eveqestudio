'use strict';
const {
  Model
} = require('sequelize');
const slugify = require('slugify');
module.exports = (sequelize, DataTypes) => {
  class subcategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // subcategory → category
      this.belongsTo(models.category, {
        foreignKey: "categoryId",
        as: "category",
      });
    }
  }
  subcategory.init({
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      subCategoryName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      subCategoryImage: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true // true = active, false = inactive
      }
  }, {
    sequelize,
    modelName: 'subcategory',
    tableName: 'subcategories',
    timestamps: true,
     hooks: {
      beforeValidate: (subcategory, options) => {
        if (!subcategory.slug && subcategory.subCategoryName) {
          subcategory.slug = slugify(subcategory.subCategoryName, { lower: true, strict: true });
        }
      }
    }
  });
  return subcategory;
};