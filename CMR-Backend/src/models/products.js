'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Product extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Product.hasMany(models.BillDetail, {
                foreignKey: 'productId'
            })
            Product.belongsTo(models.Brand, {
                foreignKey: 'id'
            })
            Product.belongsTo(models.Category, {
                foreignKey: 'id'
            })
            Product.belongsTo(models.SaleCode, {
                foreignKey: 'id'
            });
            Product.hasMany(models.ProductInventory, {
                foreignKey: 'productId'
            });
            Product.hasMany(models.PurchaseOrderDetail, {
                foreignKey: 'productId'
            });
        }
    }
    Product.init({
        name: DataTypes.STRING,
        price: DataTypes.INTEGER(11),
        img1: DataTypes.STRING,
        img2: DataTypes.STRING,
        description: DataTypes.STRING,
        deletedAt: { type: DataTypes.DATE(6), field: 'deleted_at' },
        brandId: { type: DataTypes.BIGINT(20), field: 'brand_id', references: 'brands', referencesKey: 'id' },
        categoryId: { type: DataTypes.BIGINT(20), field: 'category_id', references: 'categories', referencesKey: 'id' },
        saleCodeId: { type: DataTypes.INTEGER(11), field: 'sale_code_id', references: 'sale_codes', referencesKey: 'id' },
        warrantyPeriod: { type: DataTypes.INTEGER(11), field: 'warranty_period' },
        createdAt: { type: DataTypes.DATE(6), field: 'created_at' },
        updatedAt: { type: DataTypes.DATE(6), field: 'updated_at' },
    }, {
        sequelize,
        modelName: 'Product',
        // timestamps: false,
        tableName: 'products',
        paranoid: true
    });
    return Product;
};