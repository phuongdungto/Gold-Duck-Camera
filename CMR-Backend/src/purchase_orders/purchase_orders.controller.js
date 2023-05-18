const Joi = require('joi');
const purchaseOrderService = require('./purchase_orders.service');
const { BadRequest } = require('http-errors');
const { validate } = require('../core/utils/validate.utils');

async function createPurchaseOrder(req, res, next) {
    try {
        const schema = Joi.object({
            supplierId: Joi.number().required(),
            details: Joi.array().items({
                count: Joi.number().required(),
                price: Joi.number().required(),
                productId: Joi.number().required(),
            }).min(1).required(),
            inventoryId: Joi.number().required(),
            staffId: Joi.number().required()
        })

        const value = validate({
            ...req.body,
            staffId: req.user.id
        }, schema);

        const result = await purchaseOrderService.createPurchaseOrder(value);
        res.status(201).send(result);

    } catch (error) {
        return next(error);
    }
}
async function getPurchaseOrders(req, res, next) {
    try {
        const schema = Joi.object({
            page: Joi.number().default(1).min(1),
            limit: Joi.number().default(5).max(10),
            sort: Joi.string().allow(''),
            sortBy: Joi.string().valid(...Object.values(['asc', 'desc'])).allow(''),
            staffId: Joi.number().allow(''),
            supplierId: Joi.number().allow('')
        });

        const query = validate(req.query, schema);
        const result = await purchaseOrderService.getPurchaseOrders(query);
        return res.status(200).send(result);


    } catch (error) {
        return next(error);
    }
}
async function getPurchaseOrder(req, res, next) {
    try {
        const result = await purchaseOrderService.getPurchaseOrder(parseInt(req.params.id));
        return res.status(200).send(result);

    } catch (error) {
        return next(error);
    }
}
module.exports = {
    createPurchaseOrder,
    getPurchaseOrders,
    getPurchaseOrder
}