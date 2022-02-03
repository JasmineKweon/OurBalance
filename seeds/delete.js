const mongoose = require('mongoose');
main().catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://localhost:27017/money-record');
}

const Record = require('../models/record');

const deleteRecord = async() => {
    await Record.deleteMany({});
}

deleteRecord().then(() => {
    console.log("Successfully deleted record date in moeny-record DB");
    mongoose.connection.close();
})