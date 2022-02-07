const express = require('express');
const router = express.Router();
const records = require("../controllers/records");
const { isLoggedIn, isRelatedPerson } = require('../middleware.js');

router.post('/', isLoggedIn, records.createRecord);
router.get('/calendar', isLoggedIn, records.renderCalendar);

router.get('/new/:type', isLoggedIn, records.renderNewForm);

router.route('/:id')
    .get(isLoggedIn, records.showRecord)
    .put(isLoggedIn, isRelatedPerson, records.updateRecord)

router.get('/:id/edit', isLoggedIn, isRelatedPerson, records.renderEditForm);

module.exports = router;