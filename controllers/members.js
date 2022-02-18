const Folder = require('../models/folder');
const User = require('../models/user');

module.exports.addInvitedUser = async(req, res) => {
    const { folderId } = req.params;
    const folder = await Folder.findById(folderId);
    const user = await User.findOne({ email: req.body.email });
    if (user == null) {
        req.flash('success', 'There is no user') //Fix !
        return res.redirect(`/folders/${folderId}`);
    } else if (folder.invitedUsers.includes(user._id)) {
        req.flash('success', 'The user is already invited') //Fix !
        return res.redirect(`/folders/${folderId}`);
    } else if (folder.members.includes(user._id)) {
        req.flash('success', 'The user is already a member') //Fix !
        return res.redirect(`/folders/${folderId}`);
    }
    folder.invitedUsers.push(user);
    await folder.save();
    req.flash('success', 'Successfully sent invitation')
    res.redirect(`/folders/${folderId}`);
}

module.exports.acceptInvitation = async(req, res) => {
    const { folderId } = req.params;
    const folder = await Folder.findById(folderId);
    folder.invitedUsers.pop(req.user._id);
    folder.members.push(req.user._id);
    await folder.save();
    req.flash('success', 'Successfully accepted invitation')
    res.redirect(`/folders`);
}

module.exports.rejectInvitation = async(req, res) => {
    const { folderId } = req.params;
    const folder = await Folder.findById(folderId);
    folder.invitedUsers.pop(req.user._id);
    await folder.save();
    req.flash('success', 'Successfully rejected invitation')
    res.redirect(`/folders`);
}