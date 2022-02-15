const Record = require('./models/record');
const Folder = require('./models/folder');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    next();
}

module.exports.hasRecordAdminRight = async(req, res, next) => {
    const { id } = req.params;
    const record = await Record.findById(id);
    if ((!record.author.equals(req.user._id)) && (!record.payer.equals(req.user._id))) {
        return res.redirect(`/records/${id}`)
    }
    next();
}

module.exports.hasFolderAdminRight = async(req, res, next) => {
    const { folderId } = req.params;
    const folder = await Folder.findById(folderId);
    if (!folder.admin.equals(req.user._id)) {
        return res.redirect(`/folders`)
    }
    next();
}