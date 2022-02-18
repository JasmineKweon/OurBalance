const express = require('express');
const router = express.Router({ mergeParams: true });
const members = require('../controllers/members');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, hasFolderAdminRight } = require('../middleware.js');

router.post('/invite', isLoggedIn, hasFolderAdminRight, catchAsync(members.addInvitedUser))

router.post('/accept', isLoggedIn, catchAsync(members.acceptInvitation))

router.post('/reject', isLoggedIn, catchAsync(members.rejectInvitation))

router.post('/delete', isLoggedIn, catchAsync(members.deleteMember))



module.exports = router;