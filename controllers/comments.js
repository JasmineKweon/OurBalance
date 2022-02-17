const Record = require('../models/record');
const Comment = require('../models/comment');

module.exports.createComment = async(req, res) => {
    const { id, folderId } = req.params;
    const record = await Record.findById(id);
    const comment = new Comment(req.body.comment);
    comment.folder = folderId;
    comment.record = id;
    comment.author = req.user._id;
    comment.createdDateTime = new Date();
    record.comments.push(comment);
    await comment.save();
    await record.save();
    req.flash('success', 'Created new comment!');
    res.redirect(`/folders/${folderId}/records/${record._id}`);
}

module.exports.deleteComment = async(req, res) => {
    const { id, commentId, folderId } = req.params;
    await Record.findByIdAndUpdate(id, { $pull: { comments: commentId } });
    await Comment.findByIdAndDelete(commentId);
    req.flash('success', 'Successfully deleted comment')
    res.redirect(`/folders/${folderId}/records/${id}`);
}