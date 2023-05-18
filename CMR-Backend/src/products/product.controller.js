const Joi = require('joi');
const productService = require('./product.service');
const { BadRequest } = require('http-errors');
const { validate } = require('../core/utils/validate.utils');
const dotenv = require('dotenv');
dotenv.config();

async function createProduct(req, res, next) {
    try {
        const schema = Joi.object({
            name: Joi.string().required(),
            price: Joi.number().required(),
            description: Joi.string().required(),
            brandId: Joi.number().required(),
            categoryId: Joi.number().required(),
            saleCodeId: Joi.number(),
            images: Joi.array().required().min(2).max(2),
            warrantyPeriod: Joi.number().required()
        });
        const value = validate({
            ...req.body,
            images: Array.isArray(req.files) && req.files.map(file => file.filename)
        }, schema);
        const imagesArr = value.images;
        delete value.images;
        const result = await productService.createProduct({
            ...value,
            img1: imagesArr[0],
            img2: imagesArr[1]
        });
        return res.status(201).send(result);
    } catch (error) {
        return next(error);
    }
}

async function updateProduct(req, res, next) {
    try {
        const schema = Joi.object({
            name: Joi.string(),
            price: Joi.number(),
            description: Joi.string(),
            brandId: Joi.number(),
            categoryId: Joi.number(),
            saleCodeId: Joi.number(),
            images: Joi.any(),
            warrantyPeriod: Joi.number()
        });

        const value = validate({
            ...req.body,
            images: Array.isArray(req.files) && req.files.map(file => file.filename)
        }, schema);
        const imagesArr = value.images;
        delete value.images;
        const result = await productService.updateProduct(req.params.id, {
            ...value,
            img1: imagesArr[0],
            img2: imagesArr[1]
        });
        return res.status(200).send(result);
    } catch (error) {
        return next(error);
    }
}

async function getProduct(req, res, next) {
    try {
        const result = await productService.getProduct(req.params.id);
        return res.status(200).send(result);
    } catch (error) {
        return next(error);
    }
}

async function deleteProduct(req, res, next) {
    try {
        await productService.deleteProduct(req.params.id);
        return res.status(200).send();
    } catch (error) {
        return next(error);
    }
}

async function getProducts(req, res, next) {
    try {
        const schema = Joi.object({
            page: Joi.number().default(1).min(1),
            limit: Joi.number().default(5).max(10),
            sort: Joi.string().allow(''),
            sortBy: Joi.string().valid(...Object.values(['asc', 'desc'])).allow(''),
            description: Joi.string().allow(''),
            name: Joi.string().allow(''),
            brandId: Joi.number().allow(''),
            categoryId: Joi.number().allow(''),
        })
        const value = validate(req.query, schema);
        const result = await productService.getProducts(value);
        return res.status(200).send(result);
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    createProduct,
    updateProduct,
    getProduct,
    deleteProduct,
    getProducts
}