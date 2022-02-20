const mongoose = require('mongoose');
main().catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://localhost:27017/money-record');
}
const Record = require('../../models/record');
const Comment = require('../../models/comment');
const Folder = require('../../models/folder');
const Category = require('../../models/category');

const categories = require('./categories');

const deleteRecords = async() => {
    await Record.deleteMany({});
    await Comment.deleteMany({});
    await Folder.deleteMany({});
}

const seedCategories = async() => {
    await Category.deleteMany({});
    const category1 = new Category({
        name: 'From Last Month',
        type: 'Income'
    });
    await category1.save();
    const category2 = new Category({
        name: 'From Work',
        type: 'Income'
    });
    await category2.save();
    const category3 = new Category({
        name: 'From Investment',
        type: 'Income'
    });
    await category3.save();
    const category4 = new Category({
        name: 'From Parents',
        type: 'Income'
    });
    await category4.save();
    const category5 = new Category({
        name: 'From Others',
        type: 'Income'
    });
    await category5.save();
    const category6 = new Category({
        name: 'Others',
        type: 'Income'
    });
    await category6.save();
    const category11 = new Category({
        name: 'Restaurants / Coffee',
        type: 'Spending'
    });
    await category11.save();
    const category12 = new Category({
        name: 'Grocery',
        type: 'Spending'
    });
    await category12.save();
    const category13 = new Category({
        name: 'Convenient Store',
        type: 'Spending'
    });
    await category13.save();
    const category14 = new Category({
        name: 'Rent',
        type: 'Spending'
    });
    await category14.save();
    const category15 = new Category({
        name: 'Water Bill',
        type: 'Spending'
    });
    await category15.save();
    const category16 = new Category({
        name: 'Electricity Bill',
        type: 'Spending'
    });
    await category16.save();
    const category21 = new Category({
        name: 'Clothing',
        type: 'Spending'
    });
    await category21.save();
    const category22 = new Category({
        name: 'Health',
        type: 'Spending'
    });
    await category22.save();
    const category23 = new Category({
        name: 'Beauty / Personal Care',
        type: 'Spending'
    });
    await category23.save();
    const category24 = new Category({
        name: 'Event',
        type: 'Spending'
    });
    await category24.save();
    const category25 = new Category({
        name: 'Dating',
        type: 'Spending'
    });
    await category25.save();
    const category26 = new Category({
        name: 'Others',
        type: 'Spending'
    });
    await category26.save();
}

seedCategories().then(() => {
    console.log("Successfully seended category date to moeny-record DB");
    mongoose.connection.close();
})

// deleteRecords().then(() => {
//     console.log("Successfully seeded records to our-balance DB");
//     mongoose.connection.close();
// })