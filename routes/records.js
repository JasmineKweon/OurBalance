const express = require('express');
const router = express.Router({ mergeParams: true });
const records = require("../controllers/records");
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, hasRecordAdminRight, validateRecord } = require('../middleware.js');

router.post('/', isLoggedIn, validateRecord, catchAsync(records.createRecord));

router.get('/calendar', isLoggedIn, catchAsync(records.renderCalendar));

router.get('/new/:type', isLoggedIn, catchAsync(records.renderNewForm));

router.route('/:id')
    .get(isLoggedIn, catchAsync(records.showRecord))
    .put(isLoggedIn, hasRecordAdminRight, validateRecord, catchAsync(records.updateRecord))
    .delete(isLoggedIn, hasRecordAdminRight, catchAsync(records.deleteRecord))

router.get('/:id/edit', isLoggedIn, hasRecordAdminRight, catchAsync(records.renderEditForm));

module.exports = router;