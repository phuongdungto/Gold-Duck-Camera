'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Category extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Category.hasMany(models.Product, {
                foreignKey: 'categoryId'
            });
        }
    }
    Category.init({
        name: DataTypes.STRING,
        deletedAt: { type: DataTypes.DATE(6), field: 'deleted_at' },
        createdAt: { type: DataTypes.DATE(6), field: 'created_at' },
        updatedAt: { type: DataTypes.DATE(6), field: 'updated_at' },
    }, {
        sequelize,
        modelName: 'Category',
        paranoid: true,
        tableName: 'categories'
    });
    return Category;
};