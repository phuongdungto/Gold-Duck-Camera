'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Bill, {
        foreignKey: 'id'
      });
      User.hasMany(models.PurchaseOrder, {
        foreignKey: 'staffId'
      });
      User.hasMany(models.Token, {
        foreignKey: 'userId'
      });
    }
  }
  User.init({
    email: DataTypes.STRING,
    hashedPassword: { type: DataTypes.STRING, field: 'hashed_password' },
    fullname: DataTypes.STRING,
    gender: DataTypes.STRING,
    address: DataTypes.STRING,
    role: DataTypes.STRING,
    birthday: DataTypes.DATE,
    numberPhone: { type: DataTypes.STRING, field: 'number_phone' },
    verify: DataTypes.TINYINT,
    createdAt: { type: DataTypes.DATE(6), field: 'created_at' },
    updatedAt: { type: DataTypes.DATE(6), field: 'updated_at' },
    deletedAt: { type: DataTypes.DATE(6), field: 'deleted_at' },
  }, {
    sequelize,
    modelName: 'User',
    timestamps: false
  });
  return User;
};