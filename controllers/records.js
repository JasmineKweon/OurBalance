const Record = require('../models/record');
const User = require('../models/user');
const Category = require('../models/category');
const moment = require('moment');

let monthlyIncome;
let monthlySpending;

function sumPrice(records) {
    let sum = 0;
    for (let r of records) sum += r.price;
    return sum;
}

async function renderDatesData(year, month) {
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
        let sumSpending;
        let sumIncome;
        if (foundRecords.length > 0) {
            sumSpending = sumPrice(foundRecords.filter(record => { return record.category.type === 'Spending' }));
            sumIncome = sumPrice(foundRecords.filter(record => { return record.category.type === 'Income' }));
            monthlySpending += sumSpending;
            monthlyIncome += sumIncome;
        }
        const data = {
            index: i++,
            date: new Date(currentDate),
            totalIncome: sumIncome,
            totalSpending: sumSpending,
            records: foundRecords
        }
        dates.push(data);
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
}

module.exports.renderCalendar = async(req, res) => {
    monthlySpending = 0;
    monthlyIncome = 0;
    const year = parseInt(req.query.year);
    const month = parseInt(req.query.month);
    const dates = await renderDatesData(year, month);
    res.render('records/calendar', { dates, monthlySpending, monthlyIncome });
}

module.exports.renderIndex = async(req, res) => {
    if ((req.query.year === undefined) || (req.query.month === undefined)) {
        res.redirect(`/records/index?year=2021&month=12`)
    }
    monthlySpending = 0;
    monthlyIncome = 0;
    const year = parseInt(req.query.year);
    const month = parseInt(req.query.month);
    const dates = await renderDatesData(year, month);
    res.render('records/index', { dates, monthlySpending, monthlyIncome });
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