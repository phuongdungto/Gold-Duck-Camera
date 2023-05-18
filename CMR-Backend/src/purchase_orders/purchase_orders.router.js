const express = require('express');
const {
    createPurchaseOrder,
    getPurchaseOrders,
    getPurchaseOrder
} = require('./purchase_orders.controller');
const authorization = require("../core/middleware/auth.middleware");
const { Roles } = require('../core/constant');

const router = express.Router();

router.get('/', authorization([Roles.MANAGER, Roles.STAFF]), getPurchaseOrders);
router.get('/:id', authorization([Roles.MANAGER, Roles.STAFF]), getPurchaseOrder);
router.post('/', authorization([Roles.MANAGER, Roles.STAFF]), createPurchaseOrder);

module.exports = router;