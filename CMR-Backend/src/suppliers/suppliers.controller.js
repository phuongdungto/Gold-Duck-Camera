const Joi = require('joi');
const supplierService = require('./suppliers.service');
const { BadRequest } = require('http-errors');
const { validate } = require('../core/utils/validate.utils');

async function createSupplier(req, res, next) {
    try {
        const schema = Joi.object({
            name: Joi.string().required(),
            address: Joi.string().max(255).required(),
            numberPhone: Joi.string().min(10).max(11),
        });

        const value = validate(req.body, schema);

        const result = await supplierService.createSupplier(value);
        res.status(201).send(result);

    } catch (error) {
        return next(error);
    }
}
async function updateSupplier(req, res, next) {
    try {
        const schema = Joi.object({
            name: Joi.string(),
            address: Joi.string().max(255),
            numberPhone: Joi.string().min(10).max(11),
        });
        const value = validate(req.body, schema);
        const result = await supplierService.updateSupplier(parseInt(req.params.id), value);
        res.status(200).send(result);

    } catch (error) {
        return next(error);
    }
}
async function deleteSupplier(req, res, next) {
    try {
        const result = await supplierService.deleteSupplier(parseInt(req.params.id));
        res.status(200).send();

    } catch (error) {
        return next(error);
    }
}
async function getSuppliers(req, res, next) {
    try {
        const schema = Joi.object({
            page: Joi.number().default(1).min(1),
            limit: Joi.number().default(5).max(10),
            sort: Joi.string().allow(''),
            sortBy: Joi.string().valid(...Object.values(['asc', 'desc'])).allow(''),
            name: Joi.string().allow(''),
        });
        const query = validate(req.query, schema);
        const result = await supplierService.getSuppliers(query);
        return res.status(200).send(result);


    } catch (error) {
        return next(error);
    }
}

async function getSupplier(req, res, next) {
    try {

        const result = await supplierService.getSupplier(parseInt(req.params.id));
        return res.status(200).send(result);

    } catch (error) {
        return next(error);
    }
}
module.exports = {
    createSupplier,
    updateSupplier,
    deleteSupplier,
    getSuppliers,
    getSupplier
}