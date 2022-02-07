const express = require('express');
const router = express.Router();
const records = require("../controllers/records");

router.get('/calendar', records.renderCalendar);
router.get('/index', records.renderIndex);
router.get('/new/spending', records.renderNewSpendingForm);
router.get('/new/income', records.renderNewIncomeForm);
router.post('/', records.createRecord);
router.get('/:id', records.showRecord);

module.exports = router;