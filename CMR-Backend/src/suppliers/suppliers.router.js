const express = require('express');
const {
    createSupplier,
    updateSupplier,
    deleteSupplier,
    getSuppliers,
    getSupplier
} = require('./suppliers.controller');
const authorization = require("../core/middleware/auth.middleware");
const { Roles } = require('../core/constant')

const router = express.Router();
router.get('/', authorization([Roles.MANAGER, Roles.STAFF]), getSuppliers);
router.get('/:id', authorization([Roles.MANAGER, Roles.STAFF]), getSupplier);
router.post('/', authorization([Roles.MANAGER, Roles.STAFF]), createSupplier);
router.put('/:id', authorization([Roles.MANAGER, Roles.STAFF]), updateSupplier);
router.delete('/:id', authorization([Roles.MANAGER, Roles.STAFF]), deleteSupplier);

module.exports = router;