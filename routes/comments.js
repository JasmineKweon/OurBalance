const express = require('express');
const router = express.Router({ mergeParams: true });
const { isLoggedIn, hasRecordAdminRight } = require('../middleware.js');
const comments = require('../controllers/comments');
const catchAsync = require('../utils/catchAsync');

router.post('/', isLoggedIn, catchAsync(comments.createComment))

router.delete('/:commentId', isLoggedIn, hasRecordAdminRight, catchAsync(comments.deleteComment))

module.exports = router;