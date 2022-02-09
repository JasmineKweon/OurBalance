const express = require('express');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate')
const moment = require('moment');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const path = require('path');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const recordRoutes = require('./routes/records');
const userRoutes = require('./routes/users');
const User = require('./models/user');

const app = express();
const port = 8000;

main().catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://localhost:27017/money-record');
}

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

app.set('view engine', 'ejs');
app.engine('ejs', ejsMate)
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(flash());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.moment = moment;
    res.locals.successMsg = req.flash('success');
    res.locals.errorMsg = req.flash('error');
    next();
})

app.use("/records", recordRoutes);
app.use("/", userRoutes);

app.get('/', (req, res) => {
    res.render('home');
})

app.listen(port, () => {
    console.log(`Serving on Port ${port}`);
})