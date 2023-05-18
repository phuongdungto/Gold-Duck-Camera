const connectDB = require('../core/database.js');
const db = require('../models/index');
const { BadRequest } = require('http-errors');
const fs = require('fs/promises');
const { buildPagination } = require('../core/utils/paginantion.utils')

async function createInventory(body) {
    const newInventory = await db.Inventory.create(body);
    return newInventory;
}
async function updateInventory(id, body) {
    const inventory = await db.Inventory.findOne({ where: { id: id } });
    if (!inventory) {
        throw new BadRequest('Inventory not found');
    }
    await db.Inventory.update({ ...body }, { where: { id: id } });

    return inventory;
}
async function deleteInventory(id) {
    const inventory = await db.Inventory.findOne({ where: { id: id } });
    if (!inventory) {
        throw new BadRequest('Inventory not found');
    }
    await inventory.destroy();
}
async function getInventorys(filters) {
    const query = buildPagination(filters);
    const { rows, count } = await db.Inventory.findAndCountAll({
        ...query,
    });
    return { totalPage: Math.ceil(count / filters.limit), inventorys: rows };
}

async function getInventory(id) {
    const inventory = await db.Inventory.findOne({
        where: {
            id: id,
        },
    });
    if (!inventory) {
        throw new BadRequest('Inventory not found');
    }
    return inventory;
}
module.exports = {
    createInventory,
    updateInventory,
    deleteInventory,
    getInventorys,
    getInventory
}