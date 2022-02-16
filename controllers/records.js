const Record = require('../models/record');
const User = require('../models/user');
const Category = require('../models/category');
const moment = require('moment');

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
    const users = await User.find({});
    const type = req.params.type;
    const categories = await Category.find({ type: type });
    const { folderId } = req.params;
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
    await record.save();
    req.flash('success', 'Successfully created new record!');
    res.redirect(`/folders/${folderId}`);
}

module.exports.renderEditForm = async(req, res) => {
    const users = await User.find({});
    const record = await Record.findById(req.params.id).populate('category').populate({
        path: 'payer',
        select: 'username'
    })
    const categories = await Category.find({ type: record.category.type });
    res.render('records/edit', { users, categories, record });
}

module.exports.updateRecord = async(req, res) => {
    const { id, folderId } = req.params;
    const record = await Record.findByIdAndUpdate(id, {...req.body.record });
    req.flash('success', 'Successfully updated the record!');
    res.redirect(`/folders/${folderId}/records/${record._id}`)
}

module.exports.deleteRecord = async(req, res) => {
    const { id, folderId } = req.params;
    await Record.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the record!');
    res.redirect(`/folders/${folderId}`);
}