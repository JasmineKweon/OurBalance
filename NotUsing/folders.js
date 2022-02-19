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

//temp
function temp(record) {
    console.log(`record: ${record}`);
    console.log(`record.payer: ${record.payer}`);
    console.log(`record.payer._id: ${record.payer._id}`);
    console.log(`typeof(record.payer._id): ${typeof(record.payer._id)}`);
    console.log(`record.payer._id==620ff6a25b5e0c8154e5a95e: ${record.payer._id == '620ff6a25b5e0c8154e5a95e'}`);
    console.log(`(record.payer._id == '620ff6a25b5e0c8154e5a95e') && (record.date >= "2022-02-01") && (record.date <= "2022-02-28"): ${(record.payer._id == '620ff6a25b5e0c8154e5a95e') && (record.date >= "2022-02-01") && (record.date <= "2022-02-28")}`);
    console.log(`(record.payer._id == member._id) && (record.date >= "2022-02-01") && (record.date <= "2022-02-28"): ${(record.payer._id == member._id) && (record.date >= "2022-02-01") && (record.date <= "2022-02-28")}`);


    return ((record.payer._id == '620ff6a25b5e0c8154e5a95e') && (record.date >= "2022-02-01") && (record.date <= "2022-02-28"));
    //return ((record.payer._id == member._id) && (record.date >= "2022-02-01") && (record.date <= "2022-02-28"));
    //return record.payer._id == '620ff6a25b5e0c8154e5a95e';
    //return ((record.payer._id == '620ff6a25b5e0c8154e5a95e') && (record.date >= "2022-02-01") && (record.date <= "2022-02-28"));
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

    //temp
    // const folder = await Folder.findById(folderId);
    // const startDateString = moment(startDate).format('yyyy-MM-DD');
    // const endDateString = moment(endDate).format('yyyy-MM-DD');
    // const tempRecords = await Record.find({ folder: folderId }).populate('category').populate('payer');
    // const tempRecordArray = tempRecords.filter(record => { return ((record.payer._id == '620ff6a25b5e0c8154e5a95e') && (record.date >= startDateString) && (record.date <= endDateString)) });
    // console.log(tempRecordArray);
    // spendingStatus = sumPrice(tempRecordArray);

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

        //let tempSumSpending;

        if (foundRecords.length > 0 && currentDate.getMonth() + 1 === month) {
            sumSpending = sumPrice(foundRecords.filter(record => { return record.category.type === 'Spending' }));
            sumIncome = sumPrice(foundRecords.filter(record => { return record.category.type === 'Income' }));

            //temp
            // let tempRecordArray = foundRecords.filter(record => { return record.payer._id == '620ff6a25b5e0c8154e5a95e' });
            // console.log(`tempRecordArray: ${tempRecordArray}`);
            // tempSumSpending = sumPrice(tempRecordArray);
            // console.log(`tempSumSpending: ${tempSumSpending}`);
            // spendingStatus += tempSumSpending;
            // for (member of tempFolder.members) {
            //     console.log(`member: ${member}`);
            // }

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
        if (res.locals.successMsg && res.locals.successMsg.length) req.flash('success', res.locals.successMsg);
        return res.redirect(`/folders/${folderId}?year=${year}&month=${month}`)
    }
    monthlySpending = 0;
    monthlyIncome = 0;

    //temp
    // const folderRecords = await Record.find({ folder: folderId }).populate('payer');
    // const spendingStatus = new Map();
    // for (member of folder.members) {
    //     console.log(`member: ${member}`);
    //     console.log(`member._id: ${member._id}`);
    //     console.log(`member._id == 620ff6a25b5e0c8154e5a95e: ${member._id == '620ff6a25b5e0c8154e5a95e'}`);

    //     const tempId = '620ff6a25b5e0c8154e5a95e';
    //     console.log(`typeof tempId: ${typeof(tempId)}`);
    //     const tempId2 = member._id;
    //     console.log(`typeof tempId2: ${typeof(tempId2)}`);
    //     console.log(`tempId==tempId2: ${tempId==tempId2}`);
    ////const tempId = member._id.toString;
    ////spendingStatus.set(member.username, folderRecords.filter(record => { return ((record.payer.equals(member)) && (record.date >= "2022-02-01") && (record.date <= "2022-02-28")) }));
    //     spendingStatus.set(member.username, sumPrice(folderRecords.filter(record => { return ((record.payer.equals(member)) && (record.date >= "2022-02-01") && (record.date <= "2022-02-28")) })));
    // }
    // console.log(spendingStatus);
    // console.log(`spendingStatus.get('jasmine'): ${spendingStatus.get('jasmine')}`);



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