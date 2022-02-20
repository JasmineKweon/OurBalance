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
const User = require('./models/user');
const AppError = require('./utils/AppError');
//const helmet = require('helmet');
//const mongoSanitize = require('express-mongo-sanitize');

const recordRoutes = require('./routes/records');
const userRoutes = require('./routes/users');
const folderRoutes = require('./routes/folders');
const commentRoutes = require('./routes/comments');
const memberRoutes = require('./routes/members');

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
// app.use(mongoSanitize({
//     replaceWith: '_'
// }))
app.use(flash());
//app.use(helmet());

// const scriptSrcUrls = [
//     "https://stackpath.bootstrapcdn.com/",
//     "https://api.tiles.mapbox.com/",
//     "https://api.mapbox.com/",
//     "https://kit.fontawesome.com/",
//     "https://cdnjs.cloudflare.com/",
//     "https://cdn.jsdelivr.net",
// ];
// const styleSrcUrls = [
//     "https://kit-free.fontawesome.com/",
//     "https://stackpath.bootstrapcdn.com/",
//     "https://api.mapbox.com/",
//     "https://api.tiles.mapbox.com/",
//     "https://fonts.googleapis.com/",
//     "https://use.fontawesome.com/",
// ];
// const connectSrcUrls = [
//     "https://api.mapbox.com/",
//     "https://a.tiles.mapbox.com/",
//     "https://b.tiles.mapbox.com/",
//     "https://events.mapbox.com/",
// ];
// const fontSrcUrls = [];
// app.use(
//     helmet.contentSecurityPolicy({
//         directives: {
//             defaultSrc: [],
//             connectSrc: ["'self'", ...connectSrcUrls],
//             scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
//             styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
//             workerSrc: ["'self'", "blob:"],
//             objectSrc: [],
//             imgSrc: [
//                 "'self'",
//                 "blob:",
//                 "data:",
//                 "https://res.cloudinary.com/douqbebwk/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
//                 "https://images.unsplash.com/",
//             ],
//             fontSrc: ["'self'", ...fontSrcUrls],
//         },
//     })
// );
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.moment = moment;
    res.locals.successMsg = req.flash('success');
    res.locals.errorMsg = req.flash('error');
    next();
})

app.use("/", userRoutes);
app.use("/folders", folderRoutes);
app.use("/folders/:folderId/members", memberRoutes);
app.use("/folders/:folderId/records", recordRoutes);
app.use('/folders/:folderId/records/:id/comments', commentRoutes);

app.get('/', (req, res) => {
    res.render('home');
})

app.all('*', (req, res, next) => {
    next(new AppError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Something went wrong"
    res.status(statusCode).render('error', { err });
})

app.listen(port, () => {
    console.log(`Serving on Port ${port}`);
})