const express = require('express');
const router = express.Router({ mergeParams: true });
const members = require('../controllers/members');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, hasFolderAdminRight } = require('../middleware.js');

router.route('/')
    .post(isLoggedIn, hasFolderAdminRight, catchAsync(members.addInvitedUser))

module.exports = router;