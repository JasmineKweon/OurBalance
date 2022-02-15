const mongoose = require('mongoose');
main().catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://localhost:27017/money-record');
}
const Record = require('../models/record');
const Comment = require('../models/comment');
const Folder = require('../models/folder');

const seedRecords = async() => {
    await Record.deleteMany({});
    await Comment.deleteMany({});
    await Folder.deleteMany({});

    // for (r of records) {
    //     await new Record(r).save();
    // }
}

// seedCategories().then(() => {
//     console.log("Successfully seended category date to moeny-record DB");
//     mongoose.connection.close();
// })

seedRecords().then(() => {
    console.log("Successfully seeded records to money-record DB");
    mongoose.connection.close();
})