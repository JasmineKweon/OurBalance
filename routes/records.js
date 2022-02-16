const express = require('express');
const router = express.Router({ mergeParams: true });
const records = require("../controllers/records");
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, hasRecordAdminRight } = require('../middleware.js');

router.post('/', isLoggedIn, catchAsync(records.createRecord));

router.get('/calendar', isLoggedIn, catchAsync(records.renderCalendar));

router.get('/new/:type', isLoggedIn, catchAsync(records.renderNewForm));

router.route('/:id')
    .get(isLoggedIn, catchAsync(records.showRecord))
    .put(isLoggedIn, hasRecordAdminRight, catchAsync(records.updateRecord))
    .delete(isLoggedIn, hasRecordAdminRight, catchAsync(records.deleteRecord))

router.get('/:id/edit', isLoggedIn, hasRecordAdminRight, catchAsync(records.renderEditForm));

module.exports = router;