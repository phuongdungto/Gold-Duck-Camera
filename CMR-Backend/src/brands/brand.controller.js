const Joi = require('joi');
const brandService = require('./brand.service');
const { BadRequest } = require('http-errors');
const { validate } = require('../core/utils/validate.utils');

async function createBrand(req, res, next) {
    try {
        const schema = Joi.object({
            name: Joi.string().required()
        });
        const value = validate(req.body, schema);
        const result = await brandService.createBrand(value);
        return res.status(201).send(result);
    } catch (error) {
        return next(error);
    }
}

async function updateBrand(req, res, next) {
    try {
        const schema = Joi.object({
            name: Joi.string().required()
        });
        const value = validate(req.body, schema);
        const result = await brandService.updateBrand(req.params.id, value);
        return res.status(200).send(result);
    } catch (error) {
        return next(error);
    }
}

async function getBrand(req, res, next) {
    try {
        const result = await brandService.getBrand(req.params.id);
        return res.status(200).send(result);
    } catch (error) {
        return next(error);
    }
}

async function deleteBrand(req, res, next) {
    try {
        await brandService.deleteBrand(req.params.id);
        return res.status(200).send();
    } catch (error) {
        return next(error);
    }
}

async function getBrands(req, res, next) {
    try {
        const schema = Joi.object({
            page: Joi.number().default(1).min(1),
            limit: Joi.number().default(5).max(10),
            sort: Joi.string().allow(''),
            sortBy: Joi.string().valid(...Object.values(['asc', 'desc'])).allow(''),
            name: Joi.string()
        });
        const value = validate(req.query, schema);
        const result = await brandService.getBrands(value);
        return res.status(200).send(result);
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    createBrand,
    updateBrand,
    getBrand,
    deleteBrand,
    getBrands
}