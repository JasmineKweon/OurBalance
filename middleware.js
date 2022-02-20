const Record = require('./models/record');
const Folder = require('./models/folder');
const { recordSchema, commentSchema } = require('./schemas.js');
const AppError = require('./utils/AppError');

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

module.exports.hasFolderAccessRight = async(req, res, next) => {
    const { folderId } = req.params;
    const folder = await Folder.findById(folderId);
    if ((!folder.members.includes(req.user._id)) && (!folder.admin.equals(req.user._id))) {
        return res.redirect(`/folders`)
    }
    next();
}

module.exports.validateRecord = (req, res, next) => {
    const { error } = recordSchema.validate(req.body);
    console.log(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new AppError(msg, 400)
    } else {
        next();
    }
}

module.exports.validateComment = (req, res, next) => {
    const { error } = commentSchema.validate(req.body);
    console.log(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new AppError(msg, 400)
    } else {
        next();
    }
}