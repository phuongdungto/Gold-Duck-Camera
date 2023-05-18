const Joi = require('joi');
const userService = require('./users.service');
const { BadRequest } = require('http-errors');
const { validate } = require('../core/utils/validate.utils');

async function createUser(req, res, next) {
    try {
        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(8).required(),
            fullname: Joi.string().max(255).required(),
            birthday: Joi.date(),
            gender: Joi.string().default('male'),
            address: Joi.string().max(255).default(null),
            numberPhone: Joi.string().min(10).max(11),
            role: Joi.string().default('customer'),
            verify: Joi.boolean().default(true)
        });

        const value = validate(req.body, schema);

        const result = await userService.createUser(value);
        res.status(201).send(result);

    } catch (error) {
        return next(error);
    }
}
async function updateUser(req, res, next) {
    try {
        const schema = Joi.object({
            fullname: Joi.string().max(255),
            birthday: Joi.date(),
            gender: Joi.string().default('male'),
            address: Joi.string().max(255).default(null),
            numberPhone: Joi.string().min(10).max(11),
        });
        const value = validate(req.body, schema);
        const result = await userService.updateUser(parseInt(req.params.id), value);
        res.status(200).send(result);

    } catch (error) {
        return next(error);
    }
}
async function deleteUser(req, res, next) {
    try {
        const result = await userService.deleteUser(parseInt(req.params.id));
        res.status(200).send();

    } catch (error) {
        return next(error);
    }
}
async function getUsers(req, res, next) {
    try {
        const schema = Joi.object({
            page: Joi.number().default(1).min(1),
            limit: Joi.number().default(5).max(10),
            sort: Joi.string().allow(''),
            sortBy: Joi.string().valid(...Object.values(['asc', 'desc'])).allow(''),
            fullname: Joi.string().allow(''),
            gender: Joi.string().valid(...Object.values(['male', 'female', 'other'])).allow(''),
            address: Joi.string().allow(''),
            role: Joi.string().valid(...Object.values(['admin', 'manager', 'staff', 'customer', 'shipper'])).allow('')
        });
        const query = validate(req.query, schema);
        const result = await userService.getUsers(query);
        return res.status(200).send(result);


    } catch (error) {
        return next(error);
    }
}

async function getUser(req, res, next) {
    try {

        const result = await userService.getUser(parseInt(req.params.id));
        return res.status(200).send(result);

    } catch (error) {
        return next(error);
    }
}

async function getLockedUsers(req, res, next) {
    try {
        const schema = Joi.object({
            page: Joi.number().default(1).min(1),
            limit: Joi.number().default(5).max(10),
            sort: Joi.string().allow(''),
            sortBy: Joi.string().valid(...Object.values(['asc', 'desc'])).allow(''),
            fullname: Joi.string().allow(''),
            gender: Joi.string().valid(...Object.values(['male', 'female', 'other'])).allow(''),
            address: Joi.string().allow(''),
        });

        const query = validate(req.query, schema);
        const result = await userService.getLockedUsers(query);
        return res.status(200).send(result);

    } catch (error) {
        return next(error);
    }
}

async function changePassword(req, res, next) {
    try {
        const schema = Joi.object({
            currentPassword: Joi.string().min(8).optional(),
            newPassword: Joi.string().min(8).required()
        });

        const value = validate(req.body, schema);
        await userService.changePassword(value, req.user.email);
        return res.status(200).send();
    } catch (error) {
        return next(error);
    }
}

async function changePosition(req, res, next) {
    try {
        const schema = Joi.object({
            id: Joi.number(),
            role: Joi.string().required()
        });
        const value = validate({ id: req.params.id, ...req.body }, schema);

        await userService.changePosition(value);
        return res.status(200).send();
    } catch (error) {
        return next(error);
    }
}

async function recoverUser(req, res, next) {
    try {
        await userService.recoverUser(parseInt(req.params.id))
        return res.status(200).send();

    } catch (error) {
        return next(error);
    }
}

async function getMe(req, res, next) {
    try {
        const result = await userService.getUser(req.user.id);
        return res.status(200).send(result);

    } catch (error) {
        return next(error);
    }
}
module.exports = {
    createUser,
    updateUser,
    deleteUser,
    getUsers,
    getUser,
    changePassword,
    changePosition,
    recoverUser,
    getMe,
    getLockedUsers,
}