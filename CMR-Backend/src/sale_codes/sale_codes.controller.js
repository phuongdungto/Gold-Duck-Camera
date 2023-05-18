const Joi = require('joi');
const saleCodeService = require('./sale_codes.service');
const { BadRequest } = require('http-errors');
const { validate } = require('../core/utils/validate.utils');

async function createSaleCode(req, res, next) {
    try {
        const schema = Joi.object({
            name: Joi.string().max(255).required(),
            percent: Joi.number().required(),
            startDate: Joi.date().required(),
            endDate: Joi.date().required(),
            productIds: Joi.array().items(Joi.number())
        })

        const value = validate(req.body, schema);

        const result = await saleCodeService.createSaleCode(value);
        res.status(201).send(result);

    } catch (error) {
        return next(error);
    }
}
async function updateSaleCode(req, res, next) {
    try {
        const schema = Joi.object({
            name: Joi.string().max(255),
            percent: Joi.number(),
            startDate: Joi.date(),
            endDate: Joi.date(),
            newProductIds: Joi.array().items(Joi.number()),
            removeProductIds: Joi.array().items(Joi.number()),
        })
        const value = validate(req.body, schema);
        const result = await saleCodeService.updateSaleCode(parseInt(req.params.id), value);
        res.status(200).send(result);

    } catch (error) {
        return next(error);
    }
}
async function deleteSaleCode(req, res, next) {
    try {
        const result = await saleCodeService.deleteSaleCode(parseInt(req.params.id));
        res.status(200).send();

    } catch (error) {
        return next(error);
    }
}
async function getSaleCodes(req, res, next) {
    try {
        const schema = Joi.object({
            page: Joi.number().default(1).min(1),
            limit: Joi.number().default(5).max(10),
            sort: Joi.string().allow(''),
            sortBy: Joi.string().valid(...Object.values(['asc', 'desc'])).allow(''),
            percent: Joi.number().allow(''),
            startDate: Joi.date().allow(''),
            endDate: Joi.date().allow(''),
        });
        const query = validate(req.query, schema);
        const result = await saleCodeService.getSaleCodes(query);
        return res.status(200).send(result);


    } catch (error) {
        return next(error);
    }
}

async function getSaleCode(req, res, next) {
    try {
        const schema = Joi.object({
            id: Joi.number().min(1).required(),
        });
        const { id } = validate(req.params, schema);

        const result = await saleCodeService.getSaleCode(id);
        return res.status(200).send(result);

    } catch (error) {
        return next(error);
    }
}
module.exports = {
    createSaleCode,
    updateSaleCode,
    deleteSaleCode,
    getSaleCodes,
    getSaleCode
}