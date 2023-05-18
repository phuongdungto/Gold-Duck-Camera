const connectDB = require('../core/database.js');
const db = require('../models/index');
const { BadRequest } = require('http-errors');
const fs = require('fs/promises');
const { buildPagination } = require('../core/utils/paginantion.utils')

async function createProduct(body) {
    const newProduct = await db.Product.create(body);
    return newProduct;
}

async function updateProduct(id, body) {
    const product = await db.Product.findOne({
        where: { id: id }
    })
    // console.log(product)
    if (!product) {
        throw new BadRequest('Product not found');
    }
    if (body.img1) {
        fs.unlink(__dirname, '../../public/product/image', product.img1).catch(error => console.log(error));
        fs.unlink(__dirname, '../../public/product/image', product.img2).catch(error => console.log(error));
    }
    const newProduct = await product.update({ ...body })
    return newProduct;
}

async function getProduct(id) {
    let product = await db.Product.findOne({
        where: { id: id },
        include: db.SaleCode
    })
    if (!product) throw new BadRequest('Product not found');
    let percent = 0;
    if (product.SaleCode) {
        product = product.dataValues;
        percent = product.SaleCode.percent;
        product = {
            ...product,
            percent: percent
        }
    }
    delete product.SaleCode;
    return product;
}

async function deleteProduct(id) {
    const product = await db.Product.findOne({
        where: { id: id }
    })
    if (!product) throw new BadRequest('Product not found');

    await product.destroy();
}

async function getProducts(req) {
    const query = buildPagination(req);
    const { rows, count } = await db.Product.findAndCountAll({
        ...query,
        include: db.SaleCode
    });
    const products = rows.map((p) => {
        const product = p.dataValues;
        let percent = 0;
        if (product.SaleCode) {
            percent = product.SaleCode.percent;
        }
        delete product.SaleCode;
        return {
            ...product,
            percent
        }
    })
    console.log(products);
    return { totalPage: Math.ceil(count / req.limit), products: products };
}

module.exports = {
    createProduct,
    updateProduct,
    getProduct,
    deleteProduct,
    getProducts
}