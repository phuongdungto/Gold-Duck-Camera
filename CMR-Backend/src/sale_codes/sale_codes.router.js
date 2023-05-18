const express = require('express');
const {
    createSaleCode,
    updateSaleCode,
    deleteSaleCode,
    getSaleCodes,
    getSaleCode
} = require('./sale_codes.controller');
const authorization = require("../core/middleware/auth.middleware");
const { Roles } = require('../core/constant');

const router = express.Router();
router.get('/', authorization([Roles.MANAGER, Roles.STAFF]), getSaleCodes);
router.get('/:id', authorization([Roles.MANAGER, Roles.STAFF]), getSaleCode);
router.post('/', authorization([Roles.MANAGER, Roles.STAFF]), createSaleCode);
router.put('/:id', authorization([Roles.MANAGER, Roles.STAFF]), updateSaleCode);
router.delete('/:id', authorization([Roles.MANAGER, Roles.STAFF]), deleteSaleCode);

module.exports = router;