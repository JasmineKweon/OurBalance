const express = require('express');
const router = express.Router();
const folders = require('../controllers/folders');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn } = require('../middleware.js');

router.route('/')
    .get(isLoggedIn, catchAsync(folders.index))
    .post(isLoggedIn, catchAsync(folders.createFolder))

router.get('/new', isLoggedIn, folders.renderNewForm)

module.exports = router;