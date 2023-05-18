const express = require('express');
const {
    createUser,
    updateUser,
    deleteUser,
    getUsers,
    getUser,
    changePassword,
    changePosition,
    recoverUser,
    getMe,
    getLockedUsers,
} = require('./users.controller');
const authorization = require("../core/middleware/auth.middleware");

const router = express.Router();
router.get('/', authorization(['admin']), getUsers);
router.get('/:id', getUser);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

router.put('/locked/:id', authorization(['admin']), recoverUser);
router.put('/position/:id', authorization(['admin']), changePosition);
router.put('/me/password', authorization(), changePassword);
router.get('/me', authorization(), getMe);
router.get('/locked', authorization(['admin']), getLockedUsers);

module.exports = router;