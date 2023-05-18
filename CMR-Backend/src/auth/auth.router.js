const express = require('express');
const passport = require('passport');
const cookieSession = require('cookie-session');
require('../core/middleware/passport.middleware');
const {
    signup,
    signin,
    forgotPassword,
    loginWithGg,
    confirmAccount,
    resetPassword,
    resendOTP
} = require('./auth.controller');
const authorization = require("../core/middleware/auth.middleware");

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/password-forgot', forgotPassword);
router.post('/signup/resend-otp', resendOTP);
router.post('/signup/confirm', confirmAccount);
router.post('/password-reset', resetPassword);
router.get('/google/login', passport.authenticate('google', {
    scope: ['email', 'profile'],
}));
router.get('/google',
    passport.authenticate('google', { failureRedirect: '/error' }),
    loginWithGg
);
module.exports = router;