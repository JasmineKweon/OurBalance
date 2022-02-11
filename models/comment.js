const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    body: String,
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