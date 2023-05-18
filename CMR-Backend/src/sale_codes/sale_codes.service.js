const connectDB = require('../core/database.js');
const db = require('../models/index');
const { BadRequest } = require('http-errors');
const fs = require('fs/promises');
const { buildPagination } = require('../core/utils/paginantion.utils')

async function createSaleCode(body) {
    const { productIds, ...saleCode } = body

    const newSaleCode = await db.SaleCode.create(saleCode);

    if (productIds) {
        console.log(await db.Product.update({ saleCodeId: newSaleCode.id }, { where: { id: productIds } }))
    }

    return newSaleCode;
}
async function updateSaleCode(id, body) {
    const saleCode = await db.SaleCode.findOne({ where: { id: id } });
    if (!saleCode) {
        throw new BadRequest('SaleCode not found');
    }
    const { newProductIds, removeProductIds, ...updateSaleCode } = body

    await db.SaleCode.update({ ...updateSaleCode }, { where: { id: id } });

    if (newProductIds) {
        await db.Product.update({ saleCodeId: saleCode.id }, { where: { id: newProductIds } })
    } else if (removeProductIds) {
        await db.Product.update({ saleCodeId: null }, { where: { id: removeProductIds } })
    }

    return saleCode;
}
async function deleteSaleCode(id) {
    const saleCode = await db.SaleCode.findOne({ where: { id: id } });
    if (!saleCode) {
        throw new BadRequest('SaleCode not found');
    }
    const Product = await db.Product.findOne({ where: { saleCodeId: id } });
    if (Product !== 0) {
        throw new BadRequest('Product being used');
    }
    await saleCode.destroy();
}
async function getSaleCodes(filters) {
    const query = buildPagination(filters);
    const { rows, count } = await db.SaleCode.findAndCountAll({
        ...query,
    });
    return { totalPage: Math.ceil(count / filters.limit), saleCodes: rows };
}

async function getSaleCode(id) {
    const saleCode = await db.SaleCode.findOne({
        where: {
            id: id,
        },
    });
    if (!saleCode) {
        throw new BadRequest('Sale Code not found');
    }
    return saleCode;
}
module.exports = {
    createSaleCode,
    updateSaleCode,
    deleteSaleCode,
    getSaleCodes,
    getSaleCode
}