const express = require('express');
const {
    createBrand,
    updateBrand,
    getBrand,
    deleteBrand,
    getBrands
} = require('./brand.controller');
const authorization = require('../core/middleware/auth.middleware');
const { Roles } = require('../core/constant');
const router = express.Router();

router.post('/', authorization([Roles.MANAGER, Roles.STAFF]), createBrand);
router.put('/:id', authorization([Roles.MANAGER, Roles.STAFF]), updateBrand);
router.get('/:id', getBrand);
router.delete('/:id', authorization([Roles.MANAGER, Roles.STAFF]), deleteBrand);
router.get('/', getBrands);

module.exports = router;