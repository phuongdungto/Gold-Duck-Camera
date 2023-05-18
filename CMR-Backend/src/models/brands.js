'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Brand extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Brand.hasMany(models.Product, {
                foreignKey: 'brandId'
            });
        }
    }
    Brand.init({
        name: DataTypes.STRING,
        deletedAt: { type: DataTypes.DATE(6), field: 'deleted_at' },
        createdAt: { type: DataTypes.DATE(6), field: 'created_at' },
        updatedAt: { type: DataTypes.DATE(6), field: 'updated_at' }
    }, {
        sequelize,
        modelName: 'Brand',
        paranoid: true,
        tableName: 'brands'
    });
    return Brand;
};