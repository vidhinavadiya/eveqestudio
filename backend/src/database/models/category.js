'use strict';
const {
  Model
} = require('sequelize');
const slugify = require('slugify');

module.exports = (sequelize, DataTypes) => {
  class category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // category -> subcategory
      this.hasMany(models.subcategory, {
        foreignKey: "categoryId",
        as: "subcategories"
      });
    }
  }
  category.init({
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      categoryName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      categorySlug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      categoryDescription: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      categoryImage: {
        type: DataTypes.STRING,
        allowNull: true
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true // true = active, false = inactive
      }
  }, {
    sequelize,
    modelName: 'category',
    tableName: 'categories',
    timestamps: true,
     hooks: {
      // ✅ slug automatically set karne ke liye hook
      beforeValidate: (category, options) => {
        if (category.categoryName) {
          category.categorySlug = slugify(category.categoryName, { 
            lower: true,   // small letters
            strict: true   // special characters remove
          });
        }
      }
    }
  });
  return category;
};