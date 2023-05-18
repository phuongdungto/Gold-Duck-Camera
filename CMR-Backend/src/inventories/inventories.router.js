const express = require('express');
const {
    createInventory,
    updateInventory,
    deleteInventory,
    getInventorys,
    getInventory
} = require('./Inventories.controller');
const { Roles } = require('../core/constant');
const authorization = require("../core/middleware/auth.middleware");

const router = express.Router();
router.get('/', authorization([Roles.MANAGER, Roles.STAFF, Roles.ADMIN]), getInventorys);
router.get('/:id', authorization([Roles.MANAGER, Roles.STAFF, Roles.ADMIN]),getInventory);
router.post('/', authorization([Roles.MANAGER,  Roles.ADMIN]),createInventory);
router.put('/:id', authorization([Roles.MANAGER,  Roles.ADMIN]),updateInventory);
router.delete('/:id', authorization([Roles.MANAGER,Roles.ADMIN]),deleteInventory);

module.exports = router;