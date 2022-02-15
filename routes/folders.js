const express = require('express');
const router = express.Router();
const folders = require('../controllers/folders');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, hasFolderAdminRight } = require('../middleware.js');

router.route('/')
    .get(isLoggedIn, catchAsync(folders.index))
    .post(isLoggedIn, catchAsync(folders.createFolder))

router.get('/new', isLoggedIn, folders.renderNewForm)

router.route('/:folderId')
    .delete(isLoggedIn, hasFolderAdminRight, catchAsync(folders.deleteFolder))

module.exports = router;