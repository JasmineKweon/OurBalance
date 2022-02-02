const Record = require('../models/record');
const User = require('../models/user');
const Category = require('../models/category');

module.exports.renderNewSpendingForm = async(req, res) => {
    const users = await User.find({})
    const categories = await Category.find({ type: 'Spending' })
    res.render('records/new', { users, categories });
}

module.exports.renderNewIncomeForm = async(req, res) => {
    const users = await User.find({})
    const categories = await Category.find({ type: 'Income' })
    res.render('records/new', { users, categories });
}

module.exports.createRecord = async(req, res) => {
    const record = new Record(req.body.record);
    await record.save();
    res.redirect(`/records/new/spending`);
}