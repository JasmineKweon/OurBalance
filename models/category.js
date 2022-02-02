const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['Income', 'Spending'],
        required: true
    }
})

module.exports = mongoose.model('Category', CategorySchema);