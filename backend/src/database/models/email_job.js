'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class email_job extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  email_job.init({
    userEmail: DataTypes.STRING,
    type: DataTypes.STRING,
    payload: DataTypes.JSON,
    status: {
      type: DataTypes.ENUM('pending', 'processing', 'sent', 'failed'),
      defaultValue: 'pending'
    },
    attempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    error: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'emailJob',
    tableName: 'email_jobs',
    timestamps: true
  });
  return email_job;
};