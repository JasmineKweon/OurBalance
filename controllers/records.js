const Record = require('../models/record');

module.exports.renderNewForm = (req, res) => {
    res.render('records/new');
}

module.exports.createRecord = async(req, res) => {
    const record = new Record(req.body.record);
    await record.save();
    res.redirect(`/records/new`);
}