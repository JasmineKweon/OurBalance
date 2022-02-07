const express = require('express');
const router = express.Router();
const passport = require('passport');
const users = require("../controllers/users");

router.route('/register')
    .get(users.renderRegisterForm)
    .post(users.register)

router.route('/login')
    .get(users.renderLoginrForm)
    .post(passport.authenticate('local', { failureRedirect: '/home' }), users.login)

router.get('/logout', users.logout);

module.exports = router;