const Folder = require('../models/folder');
const User = require('../models/user');

module.exports.addInvitedUser = async(req, res) => {
    console.log('add invited user route!')
    const { folderId } = req.params;
    const folder = await Folder.findById(folderId);
    const user = await User.findOne({ email: req.body.email });
    if (user == null) {
        // console.log('user is null')
        //req.flash('error', 'There is no user') //Fix !
        req.flash('error', 'There is no user') //Fix !
        return res.redirect(`/folders/${folderId}`);
    } else if (folder.invitedUsers.includes(user._id)) {
        // console.log('invited user already invited');
        req.flash('error', 'The user is already invited') //Fix !
        return res.redirect(`/folders/${folderId}`);
    } else if (folder.members.includes(user._id)) {
        // console.log('invited user already member');
        req.flash('error', 'The user is already a member') //Fix !
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

module.exports.deleteMember = async(req, res) => {
    const { folderId } = req.params;
    const folder = await Folder.findById(folderId);
    folder.members.pop(req.user._id);
    await folder.save();
    req.flash('success', 'Successfully deleted the user')
    res.redirect(`/folders/${folderId}`);
}