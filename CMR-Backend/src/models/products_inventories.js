'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ProductInventory extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            ProductInventory.belongsTo(models.Inventory, {
                foreignKey: 'id'
            });
            ProductInventory.belongsTo(models.Product, {
                foreignKey: 'id'
            });
        }
    }
    ProductInventory.init({
        sold: DataTypes.INTEGER(11),
        amount: DataTypes.INTEGER(11),
        productId: { type: DataTypes.BIGINT(11), field: 'product_id', references: 'products', referencesKey: 'id' },
        inventoryId: { type: DataTypes.BIGINT(11), field: 'inventory_id' },
    }, {
        sequelize,
        modelName: 'ProductInventory',
        tableName: 'Products_Inventories',
        timestamps: false
    });
    return ProductInventory;
};