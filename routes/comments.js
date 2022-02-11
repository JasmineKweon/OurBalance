const express = require('express');
const router = express.Router({ mergeParams: true });
const { isLoggedIn, isRelatedPerson } = require('../middleware.js');
const comments = require('../controllers/comments');
const catchAsync = require('../utils/catchAsync');

router.post('/', isLoggedIn, catchAsync(comments.createComment))

router.delete('/:commentId', isLoggedIn, isRelatedPerson, catchAsync(comments.deleteComment))

module.exports = router;