//Connect to Express (npm i express)
const express = require('express');
const app = express();
const port = 8000;

//Connect to Mongoose (npm i mongoose)
const mongoose = require('mongoose');
main().catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://localhost:27017/money-record');
}

//Define view engine (npm i ejs)
app.set('view engine', 'ejs');

//Define view folder
const path = require('path');
app.set('views', path.join(__dirname, 'views'));

//Define Routes
const recordRoutes = require('./routes/records');
const userRoutes = require('./routes/users');

//In order to receive urlencoded as req.body
app.use(express.urlencoded({ extended: true }));

app.use("/records", recordRoutes);
app.use("/", userRoutes);

app.get('/', (req, res) => {
    res.render('home');
})

//Listening to Port
app.listen(port, () => {
    console.log(`Serving on Port ${port}`);
})