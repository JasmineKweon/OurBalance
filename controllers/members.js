const Folder = require('../models/folder');
const User = require('../models/user');

module.exports.addInvitedUser = async(req, res) => {
    const { folderId } = req.params;
    const folder = await Folder.findById(folderId);
    const user = await User.findOne({ email: req.body.email });
    //folder.invitedUsers.push(user);
    //for test
    folder.members.push(user);
    await folder.save();
    req.flash('success', 'Successfully sent invitation')
    res.redirect(`/folders/${folderId}`);
}