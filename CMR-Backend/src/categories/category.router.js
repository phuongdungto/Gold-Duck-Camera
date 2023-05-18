const express = require('express');
const {
    createCategory,
    updateCategory,
    getCategory,
    deleteCategory,
    getCategories
} = require('./category.controller');
const { Roles } = require('../core/constant');
const authorization = require('../core/middleware/auth.middleware');
const router = express.Router();

router.post('/', authorization([Roles.MANAGER, Roles.STAFF]), createCategory);
router.put('/:id', authorization([Roles.MANAGER, Roles.STAFF]), updateCategory);
router.get('/:id', getCategory);
router.delete('/:id', authorization([Roles.MANAGER, Roles.STAFF]), deleteCategory);
router.get('/', getCategories);

module.exports = router