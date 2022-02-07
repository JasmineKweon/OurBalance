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
    let year;
    let month;
    if ((req.query.year === undefined) || (req.query.month === undefined)) {
        const today = new Date();
        year = today.getFullYear();
        month = today.getMonth() + 1;
        res.redirect(`/records/calendar?year=${year}&month=${month}`)
    }
    monthlySpending = 0;
    monthlyIncome = 0;
    year = parseInt(req.query.year);
    month = parseInt(req.query.month);
    console.log(year);
    console.log(month);
    if (month === 0) {
        year = year - 1;
        month = 12;
    } else if (month === 13) {
        year = year + 1;
        month = 1;
    }
    const dates = await renderDatesData(year, month);
    res.render('records/calendar', { dates, monthlySpending, monthlyIncome, year, month });
}

module.exports.renderIndex = async(req, res) => {
    let year;
    let month;
    if ((req.query.year === undefined) || (req.query.month === undefined)) {
        const today = new Date();
        year = today.getFullYear();
        month = today.getMonth() + 1;
        res.redirect(`/records/index?year=${year}&month=${month}`)
    }
    monthlySpending = 0;
    monthlyIncome = 0;
    year = parseInt(req.query.year);
    month = parseInt(req.query.month);
    console.log(year);
    console.log(month);
    if (month === 0) {
        year = year - 1;
        month = 12;
    } else if (month === 13) {
        year = year + 1;
        month = 1;
    }
    const dates = await renderDatesData(year, month);
    res.render('records/index', { dates, monthlySpending, monthlyIncome, year, month });
}

module.exports.showRecord = async(req, res) => {
    const record = await Record.findById(req.params.id).populate('category').populate({
        path: 'payer',
        select: 'username'
    })
    res.render('records/show', { record });
}

module.exports.renderNewSpendingForm = async(req, res) => {
    const users = await User.find({});
    const categories = await Category.find({ type: 'Spending' });
    const type = 'Spending';
    res.render('records/new', { users, categories, type });
}

module.exports.renderNewIncomeForm = async(req, res) => {
    const users = await User.find({});
    const categories = await Category.find({ type: 'Income' });
    const type = 'Income';
    res.render('records/new', { users, categories, type });
}

module.exports.createRecord = async(req, res) => {
    const record = new Record(req.body.record);
    record.author = req.user._id;
    await record.save();
    res.redirect(`/records/new/spending`);
}