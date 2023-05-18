const connectDB = require('../core/database.js');
const db = require('../models/index');
const { BadRequest } = require('http-errors');
const { buildPagination } = require('../core/utils/paginantion.utils')

async function createBrand(body) {
    const brand = await db.Brand.create(body);
    return brand;
}

async function updateBrand(id, body) {
    const brand = await db.Brand.findOne({
        where: { id: id }
    })
    if (!brand) throw new BadRequest('Brand not found');
    const result = await brand.update({ ...body });
    return result;
}

async function getBrand(id) {
    const brand = await db.Brand.findOne({
        where: { id: id }
    })
    if (!brand) throw new BadRequest('Brand not found');
    return brand;
}

async function deleteBrand(id) {
    const brand = await db.Brand.findOne({
        where: { id: id }
    })
    if (!brand) throw new BadRequest('Brand not found');
    await brand.destroy();
}

async function getBrands(req) {
    const query = buildPagination(req);
    const { rows, count } = await db.Brand.findAndCountAll({
        ...query
    });
    return { totalPage: Math.ceil(count / req.limit), brands: rows };
}

module.exports = {
    createBrand,
    updateBrand,
    getBrand,
    deleteBrand,
    getBrands
}