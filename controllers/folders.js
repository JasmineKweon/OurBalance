const Folder = require('../models/folder');

module.exports.index = async(req, res) => {
    const folders = await Folder.find({ admin: req.user._id }).populate({
        path: 'admin',
        select: 'username'
    });
    res.render('folders/index', { folders });
    //res.render('folders/index');
}

module.exports.renderNewForm = (req, res) => {
    res.render('folders/new');
}

module.exports.createFolder = async(req, res) => {
    const folder = new Folder();
    folder.name = req.body.name;
    folder.admin = req.user._id;
    folder.totalIncome = 0;
    folder.totalSpending = 0;
    await folder.save();
    res.redirect(`/folders/new`);
}