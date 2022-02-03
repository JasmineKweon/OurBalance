const Record = require('../models/record');
const User = require('../models/user');
const Category = require('../models/category');
const moment = require('moment');

module.exports.renderCalendar = async(req, res) => {
    res.render('records/calendar');
}

module.exports.renderIndex = async(req, res) => {
    /* completed one 
    const year = parseInt(req.query.year);
    const month = parseInt(req.query.month);
    const prevLast = new Date(year, month - 1, 0);
    const thisLast = new Date(year, month, 0);
    const startDate = new Date(prevLast.setDate(prevLast.getDate() - prevLast.getDay()));
    const endDate = new Date(thisLast.setDate(thisLast.getDate() + (6 - thisLast.getDay())));
    let dates = new Array();
    let currentDate = startDate;

    let i = 1;
    while (currentDate <= endDate) {
        const data = {
            index: i++,
            date: new Date(currentDate),
            totalIncome: "500,000",
            totalSpending: "700,000",
            records: await Record.find({ date: moment(currentDate).format('yyyy-MM-DD') }).populate({
                path: 'category',
                select: 'name'
            }).populate({
                path: 'payer',
                select: 'username'
            })
        }
        dates.push(data);
        currentDate.setDate(currentDate.getDate() + 1);
    }
    res.render('records/index', { dates });
    */
    const year = parseInt(req.query.year);
    const month = parseInt(req.query.month);
    const prevLast = new Date(year, month - 1, 0);
    const thisLast = new Date(year, month, 0);
    const startDate = new Date(prevLast.setDate(prevLast.getDate() - prevLast.getDay()));
    const endDate = new Date(thisLast.setDate(thisLast.getDate() + (6 - thisLast.getDay())));
    let dates = new Array();
    let currentDate = startDate;

    let i = 1;
    while (currentDate <= endDate) {
        const foundRecords = await Record.find({ date: moment(currentDate).format('yyyy-MM-DD') }).populate('category').populate({
            path: 'payer',
            select: 'username'
        })

        if (foundRecords.length !== 0) {
            console.log(currentDate)
            console.log(foundRecords)
            console.log(currentDate)
        }

        const data = {
            index: i++,
            date: new Date(currentDate),
            totalIncome: "500,000",
            totalSpending: "700,000",
            records: foundRecords
        }
        dates.push(data);
        currentDate.setDate(currentDate.getDate() + 1);
    }
    res.render('records/index', { dates });
}

module.exports.renderNewSpendingForm = async(req, res) => {
    const users = await User.find({});
    const categories = await Category.find({ type: 'Spending' })
    res.render('records/new', { users, categories });
}

module.exports.renderNewIncomeForm = async(req, res) => {
    const users = await User.find({});
    const categories = await Category.find({ type: 'Income' })
    res.render('records/new', { users, categories });
}

module.exports.createRecord = async(req, res) => {
    const record = new Record(req.body.record);
    record.author = req.user._id;
    await record.save();
    res.redirect(`/records/new/spending`);
}