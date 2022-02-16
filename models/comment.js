const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    body: String,
    folder: {
        type: Schema.Types.ObjectId,
        ref: 'Folder',
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdDateTime: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model("Comment", commentSchema);