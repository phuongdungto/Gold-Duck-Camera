const express = require('express');
const {
    createProduct,
    updateProduct,
    getProduct,
    deleteProduct,
    getProducts
} = require('./product.controller');
const { Roles } = require('../core/constant');
const authorization = require("../core/middleware/auth.middleware");
const { productImageUpload } = require('../core/static/image.static');

const router = express.Router();

router.post('/', authorization([Roles.MANAGER, Roles.STAFF]), productImageUpload.array('images', 2), createProduct);
router.put('/:id', authorization([Roles.MANAGER, Roles.STAFF]), productImageUpload.array('images', 2), updateProduct);
router.get('/:id', getProduct);
router.delete('/:id', authorization([Roles.MANAGER, Roles.STAFF]), deleteProduct);
router.get('/', getProducts);
module.exports = router;