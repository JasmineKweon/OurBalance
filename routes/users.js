const express = require('express');
const router = express.Router();

const passport = require('passport');
const users = require("../controllers/users");

router.get('/register', users.renderRegisterForm);
router.get('/login', users.renderLoginrForm);

router.post('/register', users.register);
router.post('/login', passport.authenticate('local', { failureRedirect: '/home' }), users.login);

module.exports = router;