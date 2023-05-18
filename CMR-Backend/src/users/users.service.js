const connectDB = require('../core/database.js');
const db = require('../models/index');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { BadRequest } = require('http-errors');
const saltRounds = 10;
const dotenv = require('dotenv');
dotenv.config();
const { buildPagination } = require('../core/utils/paginantion.utils')

async function createUser(body) {
    const existed = await db.User.findOne({ where: { email: body.email } })
    if (existed) {
        throw new BadRequest('Email already existed');
    }
    const salt = await bcrypt.genSalt(saltRounds)
    const hashPwd = await bcrypt.hash(body.password, salt);

    const newUser = await db.User.create({
        ...body,
        hashedPassword: hashPwd,
    });
    delete hashPwd;
    delete newUser.dataValues.hashedPassword;
    return newUser;
}
async function updateUser(id, body) {
    const user = await db.User.findOne({ where: { id: id } });
    if (!user) {
        throw new BadRequest('User not found');
    }
    await db.User.update({ ...body }, { where: { id: id } });
    delete user.dataValues.hashedPassword;
    return user;
}
async function deleteUser(id) {
    const user = await db.User.findOne({ where: { id: id } });
    if (!user) {
        throw new BadRequest('User not found');
    }
    await user.destroy();
}
async function getUsers(filters) {
    const query = buildPagination(filters);
    const { rows, count } = await db.User.findAndCountAll({
        ...query,
    });
    return { totalPage: Math.ceil(count / filters.limit), users: rows };
}

async function getUser(id) {
    const user = await db.User.findOne({
        where: {
            id: id,
        },
        attributes: ['address', 'birthday', 'createdAt', 'deletedAt', 'updatedAt', 'email', 'fullname', 'gender', 'id', 'numberPhone', 'role']

    });
    if (!user) {
        throw new BadRequest('User not found');
    }
    return user;
}
module.exports = {
    createUser,
    updateUser,
    deleteUser,
    getUsers,
    getUser
}