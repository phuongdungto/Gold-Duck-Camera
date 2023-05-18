'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Supplier extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Supplier.hasMany(models.PurchaseOrder, {
                foreignKey: 'supplierId'
            });
        }
    }
    Supplier.init({
        name: DataTypes.STRING,
        percent: DataTypes.INTEGER(11),
        deletedAt: { type: DataTypes.DATE(6), field: 'deleted_at' },
        numberPhone: { type: DataTypes.STRING, field: 'number_phone' },
        createdAt: { type: DataTypes.DATE(6), field: 'created_at' },
        updatedAt: { type: DataTypes.DATE(6), field: 'updated_at' },
    }, {
        sequelize,
        modelName: 'Supplier',
        tableName: 'Suppliers',
        paranoid: true
    });
    return Supplier;
};