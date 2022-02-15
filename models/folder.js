const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FolderSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    admin: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    invitedUser: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    totalIncome: {
        type: Number,
        required: true
    },
    totalSpending: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('Folder', FolderSchema);