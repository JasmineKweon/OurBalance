const Folder = require('../models/folder');
const Record = require('../models/record');
const Comment = require('../models/comment');
const moment = require('moment');

let monthlyIncome;
let monthlySpending;

function sumPrice(records) {
    let sum = 0;
    for (let r of records) sum += r.price;
    return sum;
}

async function getSpendingStatus(year, month, folderId) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    const folder = await Folder.findById(folderId).populate({
        path: 'members',
        select: 'username'
    });
    const folderRecords = await Record.find({ folder: folderId }).populate('payer');
    const spendingStatus = new Map();
    for (member of folder.members) {
        spendingStatus.set(member.username, sumPrice(folderRecords.filter(record => { return ((record.payer.equals(member)) && (record.date >= moment(startDate).format('yyyy-MM-DD')) && (record.date <= moment(endDate).format('yyyy-MM-DD'))) })));
    }
    return spendingStatus;
}

async function renderDatesData(year, month, folderId) {
    const prevLast = new Date(year, month - 1, 0);
    const thisLast = new Date(year, month, 0);
    const startDate = new Date(prevLast.setDate(prevLast.getDate() - prevLast.getDay()));
    const endDate = new Date(thisLast.setDate(thisLast.getDate() + (6 - thisLast.getDay())));
    let dates = new Array();
    let currentDate = startDate;
    let i = 1;
    while (currentDate <= endDate) {
        const foundRecords = await Record.find({ folder: folderId, date: moment(currentDate).format('yyyy-MM-DD') }).populate('category').populate({
            path: 'payer',
            select: 'username'
        })
        let sumSpending;
        let sumIncome;
        if (foundRecords.length > 0 && currentDate.getMonth() + 1 === month) {
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

module.exports.index = async(req, res) => {
    const folders = await Folder.find({ members: { "$in": [req.user._id] } }).populate({
        path: 'invitedUsers',
        select: 'username'
    }).populate({
        path: 'members',
        select: 'username'
    });
    const invitedFolders = await Folder.find({ invitedUsers: { "$in": [req.user._id] } }).populate({
        path: 'invitedUsers',
        select: 'username'
    }).populate({
        path: 'members',
        select: 'username'
    });
    res.render('folders/index', { folders, invitedFolders });
}

module.exports.renderNewForm = (req, res) => {
    res.render('folders/new');
}

module.exports.createFolder = async(req, res) => {
    const folder = new Folder();
    folder.name = req.body.name;
    folder.admin = req.user._id;
    folder.members.push(req.user._id);
    folder.totalIncome = 0;
    folder.totalSpending = 0;
    await folder.save();
    req.flash('success', 'Successfully made a new folder!');
    res.redirect(`/folders`);
}

module.exports.deleteFolder = async(req, res) => {
    const { folderId } = req.params;
    await Comment.deleteMany({ folder: folderId });
    await Record.deleteMany({ folder: folderId });
    await Folder.findByIdAndDelete(folderId);
    req.flash('success', 'Successfully deleted the folder!');
    res.redirect('/folders');
}

module.exports.showCalendar = async(req, res) => {
    const { folderId } = req.params;
    const folder = await Folder.findById(folderId).populate({
        path: 'members',
        select: 'username'
    });
    let year;
    let month;
    if ((req.query.year === undefined) || (req.query.month === undefined)) {
        const today = new Date();
        year = today.getFullYear();
        month = today.getMonth() + 1;
        if (res.locals.success && res.locals.success.length) req.flash('success', res.locals.success);
        if (res.locals.error && res.locals.error.length) req.flash('error', res.locals.error);
        return res.redirect(`/folders/${folderId}?year=${year}&month=${month}`)
    }
    monthlySpending = 0;
    monthlyIncome = 0;
    year = parseInt(req.query.year);
    month = parseInt(req.query.month);
    if (month === 0) {
        year = year - 1;
        month = 12;
    } else if (month === 13) {
        year = year + 1;
        month = 1;
    }
    const dates = await renderDatesData(year, month, folderId);
    const spendingStatus = await getSpendingStatus(year, month, folderId);
    res.render('folders/show', { dates, monthlySpending, monthlyIncome, spendingStatus, year, month, folder });
}