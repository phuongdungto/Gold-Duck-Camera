'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class PurchaseOrderDetail extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            PurchaseOrderDetail.belongsTo(models.PurchaseOrder, {
                foreignKey: 'id'
            });
            PurchaseOrderDetail.belongsTo(models.Product, {
                foreignKey: 'id'
            });
        }
    }
    PurchaseOrderDetail.init({
        count: DataTypes.INTEGER(11),
        price: DataTypes.INTEGER(11),
        purchaseOrderId: { type: DataTypes.BIGINT(20), field: 'purchase_order_id', references: 'purchase_orders', referencesKey: 'id' },
        productId: { type: DataTypes.BIGINT(20), field: 'product_id', references: 'products', referencesKey: 'id' },
    }, {
        sequelize,
        timestamps: false,
        modelName: 'PurchaseOrderDetail',
        tableName: 'Purchase_Order_Details',

    });
    return PurchaseOrderDetail;
};