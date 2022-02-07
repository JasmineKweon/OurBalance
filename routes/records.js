const express = require('express');
const router = express.Router();
const records = require("../controllers/records");

router.get('/calendar', records.renderCalendar);
// router.get('/index', records.renderIndex);
// router.get('/new/spending', records.renderNewSpendingForm);
// router.get('/new/income', records.renderNewIncomeForm);
router.get('/new/:type', records.renderNewForm);
router.post('/', records.createRecord);
router.get('/:id', records.showRecord);
router.put('/:id', records.updateRecord);
router.get('/:id/edit', records.renderEditForm);

module.exports = router;