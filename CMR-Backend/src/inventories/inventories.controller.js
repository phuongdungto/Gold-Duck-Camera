const Joi = require('joi');
const InventoryService = require('./inventories.service');
const { BadRequest } = require('http-errors');
const { validate } = require('../core/utils/validate.utils');

async function createInventory(req, res, next) {
    try {
        const schema = Joi.object({
            name: Joi.string().required(),
            address: Joi.string().required()
        });

        const value = validate(req.body, schema);

        const result = await InventoryService.createInventory(value);
        res.status(201).send(result);

    } catch (error) {
        return next(error);
    }
}
async function updateInventory(req, res, next) {
    try {
        const schema = Joi.object({
            name: Joi.string().required(),
            address: Joi.string().required()
        });
        const value = validate(req.body, schema);
        const result = await InventoryService.updateInventory(parseInt(req.params.id), value);
        res.status(200).send(result);

    } catch (error) {
        return next(error);
    }
}
async function deleteInventory(req, res, next) {
    try {
        await InventoryService.deleteInventory(parseInt(req.params.id));
        res.status(200).send();

    } catch (error) {
        return next(error);
    }
}
async function getInventorys(req, res, next) {
    try {
        const schema = Joi.object({
            page: Joi.number().default(1).min(1),
            limit: Joi.number().default(5).max(10),
            sort: Joi.string().allow(''),
            sortBy: Joi.string().valid(...Object.values(['asc', 'desc'])).allow(''),
            name: Joi.string().allow(''),
            address: Joi.string().allow(''),
        });
        const query = validate(req.query, schema);
        const result = await InventoryService.getInventorys(query);
        return res.status(200).send(result);


    } catch (error) {
        return next(error);
    }
}

async function getInventory(req, res, next) {
    try {

        const result = await InventoryService.getInventory(parseInt(req.params.id));
        return res.status(200).send(result);

    } catch (error) {
        return next(error);
    }
}
module.exports = {
    createInventory,
    updateInventory,
    deleteInventory,
    getInventorys,
    getInventory
}