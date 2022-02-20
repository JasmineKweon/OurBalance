const express = require('express');
const router = express.Router({ mergeParams: true });
const { isLoggedIn, hasRecordAdminRight, validateComment } = require('../middleware.js');
const comments = require('../controllers/comments');
const catchAsync = require('../utils/catchAsync');

router.post('/', isLoggedIn, validateComment, catchAsync(comments.createComment))

router.delete('/:commentId', isLoggedIn, hasRecordAdminRight, catchAsync(comments.deleteComment))

module.exports = router;