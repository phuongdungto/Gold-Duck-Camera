const express = require('express');
const { Roles, ANONYMOUS_USER } = require('../core/constant');
const authorization = require('../core/middleware/auth.middleware');
const {
    createBill,
    getBill,
    getBills,
    acceptBill,
    getHistory,
    shipping,
    getShippingFee
} = require('./bill.controller');

const router = express.Router();

router.post('/', authorization([ANONYMOUS_USER, Roles.CUSTOMER]), createBill);
// router.get('/:id', authorization([Roles.CUSTOMER]), getBill);
router.get('/', authorization([Roles.MANAGER, Roles.STAFF, Roles.SHIPPER]), getBills);
router.put('/:id', authorization([Roles.MANAGER, Roles.STAFF]), acceptBill);
router.get('/history', authorization([Roles.CUSTOMER]), getHistory);
router.put('/ship/:id', authorization([Roles.SHIPPER]), shipping);
router.post('/shipping', getShippingFee);

module.exports = router;