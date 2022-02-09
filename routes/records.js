const express = require('express');
const router = express.Router();
const records = require("../controllers/records");
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isRelatedPerson } = require('../middleware.js');

router.post('/', isLoggedIn, catchAsync(records.createRecord));
router.get('/calendar', isLoggedIn, catchAsync(records.renderCalendar));

router.get('/new/:type', isLoggedIn, catchAsync(records.renderNewForm));

router.route('/:id')
    .get(isLoggedIn, catchAsync(records.showRecord))
    .put(isLoggedIn, isRelatedPerson, catchAsync(records.updateRecord))
    .delete(isLoggedIn, isRelatedPerson, catchAsync(records.deleteRecord))

router.get('/:id/edit', isLoggedIn, isRelatedPerson, catchAsync(records.renderEditForm));

module.exports = router;