const { Op } = require("sequelize");

function buildPagination({ page, limit, sort, sortBy, ...filters }) {
    const offset = limit * (page - 1);
    let where = {};
    let order = [];
    Object.keys(filters).forEach(key => {
        const value = filters[key];
        if (value === '') {
            return;
        }

        if (typeof value === 'string') {
            where[key] = { [Op.like]: `%${value}%` };
            return;
        }

        where[key] = value;
    })
    if (sort != undefined) {
        const tmp = [];
        tmp.push(sort, sortBy)
        order.push(tmp)
    }

    return {
        offset,
        limit,
        where,
        order
    }
}

module.exports = {
    buildPagination
}