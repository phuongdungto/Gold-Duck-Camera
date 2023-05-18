'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class SaleCode extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            SaleCode.hasMany(models.Product, {
                foreignKey: 'saleCodeId'
            });
        }
    }
    SaleCode.init({
        name: DataTypes.STRING,
        percent: DataTypes.INTEGER(11),
        startDate: { type: DataTypes.DATE, field: 'start_date' },
        endDate: { type: DataTypes.DATE, field: 'end_date' },
        createdAt: { type: DataTypes.DATE(6), field: 'created_at' },
        updatedAt: { type: DataTypes.DATE(6), field: 'updated_at' },
    }, {
        sequelize,
        modelName: 'SaleCode',
        tableName: 'Sale_codes',
        timestamps: false
    });
    return SaleCode;
};