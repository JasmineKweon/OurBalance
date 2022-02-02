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

const User = require('./models/user');

//In order to receive urlencoded as req.body
app.use(express.urlencoded({ extended: true }));

//Session (npm i express-session)
const session = require('express-session');
const sessionConfig = {
    name: 'session',
    secret: 'tlzmfltwjdqh',
    resave: false,
    saveUninitialized: true,
    cookei: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));

// Passport (npm i passport passport-local)
//https://www.npmjs.com/package/passport-local-mongoose
//https://www.passportjs.org/concepts/authentication/strategies/
const passport = require('passport');
const LocalStrategy = require('passport-local');
//To Initialize passport
app.use(passport.initialize());
//To use persistent login sessions
app.use(passport.session());
// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/records", recordRoutes);
app.use("/", userRoutes);

app.get('/', (req, res) => {
    res.render('home');
})

//Listening to Port
app.listen(port, () => {
    console.log(`Serving on Port ${port}`);
})