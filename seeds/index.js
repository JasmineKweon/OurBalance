const mongoose = require('mongoose');
main().catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://localhost:27017/money-record');
}

const Category = require('../models/category');

const seedCategories = async() => {
    const category1 = new Category({
        name: 'From Last Month',
        type: 'Income'
    })
    const category2 = new Category({
        name: 'From Work',
        type: 'Income'
    })
    const category3 = new Category({
        name: 'From Investment',
        type: 'Income'
    })
    const category4 = new Category({
        name: 'From Parents',
        type: 'Income'
    })
    const category5 = new Category({
        name: 'From Others',
        type: 'Income'
    })
    const category6 = new Category({
        name: 'Others',
        type: 'Income'
    })
    const category11 = new Category({
        name: 'Restaurants / Coffee',
        type: 'Spending'
    })
    const category12 = new Category({
        name: 'Grocery',
        type: 'Spending'
    })
    const category13 = new Category({
        name: 'Convenient Store',
        type: 'Spending'
    })
    const category14 = new Category({
        name: 'Rent',
        type: 'Spending'
    })
    const category15 = new Category({
        name: 'Water Bill',
        type: 'Spending'
    })
    const category16 = new Category({
        name: 'Electricity Bill',
        type: 'Spending'
    })
    const category17 = new Category({
        name: 'Clothing',
        type: 'Spending'
    })
    const category18 = new Category({
        name: 'Health',
        type: 'Spending'
    })
    const category19 = new Category({
        name: 'Beauty / Personal Care',
        type: 'Spending'
    })
    const category20 = new Category({
        name: 'Event',
        type: 'Spending'
    })
    const category21 = new Category({
        name: 'Dating',
        type: 'Spending'
    })
    const category22 = new Category({
        name: 'Others',
        type: 'Spending'
    })
    await category1.save();
    await category2.save();
    await category3.save();
    await category4.save();
    await category5.save();
    await category6.save();
    await category11.save();
    await category12.save();
    await category13.save();
    await category14.save();
    await category15.save();
    await category16.save();
    await category17.save();
    await category18.save();
    await category19.save();
    await category20.save();
    await category21.save();
    await category22.save();
}

seedCategories().then(() => {
    console.log("Successfully seended category date to moeny-record DB");
    mongoose.connection.close();
})