'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
static associate(models) {
  // Ek user ke bahut saare reviews ho sakte hain
  user.hasMany(models.Review, {
    foreignKey: 'userId',
    as: 'reviews'
  });
}
  }
  user.init({
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {  
          isEmail: true
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      role: {
        type: DataTypes.ENUM('customer','seller','admin'),
        allowNull: false,
        defaultValue: 'customer'
      },
      phone: { 
        type: DataTypes.STRING, 
        allowNull: true 
      },
      address: { 
        type: DataTypes.TEXT, 
        allowNull: true 
      },
      city: { 
        type: DataTypes.STRING, 
        allowNull: true 
      },
      state: { 
        type: DataTypes.STRING, 
        allowNull: true 
      },
      pincode: { 
        type: DataTypes.STRING, 
        allowNull: true 
      },
      otp: {
        type: DataTypes.STRING,
        allowNull: true
      },
      otpExpires: {
        type: DataTypes.DATE,
        allowNull: true
      }
  }, {
    sequelize,
    modelName: 'user',
    tableName: 'users',
    timestamps: true
  });
  return user;
};