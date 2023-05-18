'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Inventory extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Inventory.hasMany(models.ProductInventory, {
                foreignKey: 'inventoryId'
            });
        }
    }
    Inventory.init({
        name: DataTypes.STRING,
        address: DataTypes.STRING,
        createdAt: { type: DataTypes.DATE(6), field: 'created_at' },
        updatedAt: { type: DataTypes.DATE(6), field: 'updated_at' },
        deletedAt: { type: DataTypes.DATE(6), field: 'deleted_at' },
    }, {
        sequelize,
        modelName: 'Inventory',
        tableName: 'inventories',
        timestamps: false
    });
    return Inventory;
};