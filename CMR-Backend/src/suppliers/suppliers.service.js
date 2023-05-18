const connectDB = require('../core/database.js');
const db = require('../models/index');
const { BadRequest } = require('http-errors');
const fs = require('fs/promises');
const { buildPagination } = require('../core/utils/paginantion.utils')

async function createSupplier(body) {
    const existed = await db.Supplier.findOne({ where: { name: body.name } })
    if (existed) {
        throw new BadRequest('Supplier name already existed');
    }
    const newSupplier = await db.Supplier.create(body);

    return newSupplier;
}
async function updateSupplier(id, body) {
    const supplier = await db.Supplier.findOne({ where: { id: id } });
    if (!supplier) {
        throw new BadRequest('Supplier not found');
    }
    await db.Supplier.update({ ...body }, { where: { id: id } });

    return supplier;
}
async function deleteSupplier(id) {
    const supplier = await db.Supplier.findOne({ where: { id: id } });
    if (!supplier) {
        throw new BadRequest('Supplier not found');
    }
    await supplier.destroy();
}
async function getSuppliers(filters) {
    const query = buildPagination(filters);
    const { rows, count } = await db.Supplier.findAndCountAll({
        ...query,
    });
    return { totalPage: Math.ceil(count / filters.limit), suppliers: rows };
}

async function getSupplier(id) {
    const supplier = await db.Supplier.findOne({
        where: {
            id: id,
        },
    });
    if (!supplier) {
        throw new BadRequest('Supplier not found');
    }
    return supplier;
}
module.exports = {
    createSupplier,
    updateSupplier,
    deleteSupplier,
    getSuppliers,
    getSupplier
}