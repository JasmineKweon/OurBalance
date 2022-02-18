const Record = require('../models/record');
const Comment = require('../models/comment');
const User = require('../models/user');
const Category = require('../models/category');
const moment = require('moment');
const Folder = require('../models/folder');

module.exports.showRecord = async(req, res) => {
    const record = await Record.findById(req.params.id).populate('category').populate({
        path: 'payer',
        select: 'username'
    }).populate({
        path: 'comments',
        populate: {
            path: 'author',
            select: 'username'
        }
    })
    res.render('records/show', { record });
}

module.exports.renderNewForm = async(req, res) => {
    const { folderId } = req.params;
    const folder = await Folder.findById(folderId);
    const users = await User.find({ _id: { $in: folder.members } });
    const type = req.params.type;
    const categories = await Category.find({ type: type });
    let date = moment(new Date()).format('yyyy-MM-DD');
    if (req.query.date !== undefined) {
        date = req.query.date;
    }
    res.render('records/new', { users, categories, type, date, folderId });
}

module.exports.createRecord = async(req, res) => {
    const record = new Record(req.body.record);
    const { folderId } = req.params;
    record.folder = folderId;
    record.author = req.user._id;
    const category = await Category.findById(record.category);
    if (category.type === 'Spending') {
        await Folder.findByIdAndUpdate(folderId, { $inc: { totalSpending: record.price } });
    } else if (category.type === 'Income') {
        await Folder.findByIdAndUpdate(folderId, { $inc: { totalIncome: record.price } });
    }
    await record.save();
    req.flash('success', 'Successfully created new record!');
    res.redirect(`/folders/${folderId}?year=${record.date.split("-")[0]}&month=${record.date.split("-")[1]}`)
}

module.exports.renderEditForm = async(req, res) => {
    const { folderId } = req.params;
    const folder = await Folder.findById(folderId);
    const users = await User.find({ _id: { $in: folder.members } });
    const record = await Record.findById(req.params.id).populate('category').populate({
        path: 'payer',
        select: 'username'
    })
    const categories = await Category.find({ type: record.category.type });
    res.render('records/edit', { users, categories, record });
}

module.exports.updateRecord = async(req, res) => {
    const { id, folderId } = req.params;
    const record = await Record.findById(id);
    const updatedRecord = await Record.findByIdAndUpdate(id, {...req.body.record });
    const category = await Category.findById(record.category);
    if (category.type === 'Spending') {
        await Folder.findByIdAndUpdate(folderId, { $inc: { totalSpending: req.body.record.price - record.price } });
    } else if (category.type === 'Income') {
        await Folder.findByIdAndUpdate(folderId, { $inc: { totalIncome: req.body.record.price - record.price } });
    }



    console.log(`record.price: ${record.price}`);
    console.log(`updatedRecord.price: ${req.body.record.price}`);
    console.log(`record.price - updatedRecord.price: ${record.price - req.body.record.price}`);
    req.flash('success', 'Successfully updated the record!');
    res.redirect(`/folders/${folderId}/records/${updatedRecord._id}`)
}

module.exports.deleteRecord = async(req, res) => {
    const { id, folderId } = req.params;
    const record = await Record.findById(id);
    const category = await Category.findById(record.category);
    if (category.type === 'Spending') {
        await Folder.findByIdAndUpdate(folderId, { $inc: { totalSpending: -record.price } });
    } else if (category.type === 'Income') {
        await Folder.findByIdAndUpdate(folderId, { $inc: { totalIncome: -record.price } });
    }
    await Comment.deleteMany({ record: id });
    await Record.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the record!');
    res.redirect(`/folders/${folderId}?year=${record.date.split("-")[0]}&month=${record.date.split("-")[1]}`)
}