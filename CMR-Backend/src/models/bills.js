'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Bill extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Bill.hasMany(models.BillDetail, {
                foreignKey: 'billId'
            });
            Bill.belongsTo(models.User, {
                foreignKey: 'id'
            });
        }
    }
    Bill.init({
        customerName: { type: DataTypes.STRING, field: 'customer_name' },
        address: DataTypes.STRING,
        states: DataTypes.ENUM('waiting', 'accepted', 'shipping', 'delivering', 'delivered', 'cancel'),
        status: DataTypes.ENUM('unpaid', 'paid'),
        userId: { type: DataTypes.BIGINT(20), field: 'user_id', references: 'users', referencesKey: 'id' },
        numberPhone: { type: DataTypes.STRING(11), field: 'number_phone' },
        shipperId: { type: DataTypes.BIGINT(20), field: 'shipper_id' },
        shippingFee: { type: DataTypes.INTEGER(11), field: 'shipping_fee' },
        createdAt: { type: DataTypes.DATE(6), field: 'created_at' },
        updatedAt: { type: DataTypes.DATE(6), field: 'updated_at' }
    }, {
        sequelize,
        modelName: 'Bill',
        timestamps: false,
        tableName: 'bills'
    });
    return Bill;
};