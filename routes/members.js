const express = require('express');
const router = express.Router({ mergeParams: true });
const members = require('../controllers/members');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, hasFolderAdminRight } = require('../middleware.js');

router.post('/invite', isLoggedIn, catchAsync(members.addInvitedUser))

router.post('/accept', isLoggedIn, catchAsync(members.acceptInvitation))

router.post('/reject', isLoggedIn, catchAsync(members.rejectInvitation))

router.post('/delete', isLoggedIn, hasFolderAdminRight, catchAsync(members.deleteMember))



module.exports = router;