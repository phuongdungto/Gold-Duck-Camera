'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Token extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Token.belongsTo(models.User, {
        foreignKey: 'id'
      });
    }
  }
  Token.init({
    token: DataTypes.STRING,
    expiredAt: { type: DataTypes.DATE, field: 'expired_at' },
    userId: { type: DataTypes.BIGINT, field: 'user_id', references: 'users', referencesKey: 'id' },
    type: DataTypes.STRING,
    createdAt: { type: DataTypes.DATE(6), field: 'created_at' },
    updatedAt: { type: DataTypes.DATE(6), field: 'updated_at' }
  }, {
    sequelize,
    timestamps: false,
    modelName: 'Token',
    tableName: 'tokens'
  });
  return Token;
};