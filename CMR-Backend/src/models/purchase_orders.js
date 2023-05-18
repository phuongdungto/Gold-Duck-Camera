'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class PurchaseOrder extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            PurchaseOrder.belongsTo(models.Supplier, {
                foreignKey: 'id'
            });
            PurchaseOrder.belongsTo(models.User, {
                foreignKey: 'id'
            });
            PurchaseOrder.hasMany(models.PurchaseOrderDetail, {
                foreignKey: 'purchaseOrderId'
            });
        }
    }
    PurchaseOrder.init({
        supplierId: { type: DataTypes.BIGINT(20), field: 'supplier_id', references: 'suppliers', referencesKey: 'id' },
        staffId: { type: DataTypes.BIGINT(20), field: 'staff_id', references: 'users', referencesKey: 'id' },
        createdAt: { type: DataTypes.DATE(6), field: 'created_at' },
        updatedAt: { type: DataTypes.DATE(6), field: 'updated_at' },
    }, {
        sequelize,
        modelName: 'PurchaseOrder',
        tableName: 'Purchase_Orders',
        timestamps: false
    });
    return PurchaseOrder;
};