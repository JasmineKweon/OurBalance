const express = require('express');
const router = express.Router();
const records = require("../controllers/records");

router.get('/new', records.renderNewForm);
router.post('/', records.createRecord);

module.exports = router;