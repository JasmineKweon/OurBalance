const User = require('../models/user');

module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register');
}

module.exports.renderLoginrForm = (req, res) => {
    res.render('users/login');
}

module.exports.register = async(req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            //req.flash('success', 'Welcome to YelpCamp');
            res.redirect('/records/calendar');
        })
    } catch (e) {
        //req.flash("error", e.message);
        res.redirect('/register');
    }
}

module.exports.login = (req, res) => {
    //req.flash('success', 'welcome back');
    //const redirectUrl = req.session.returnTo || '/campgrounds';
    //delete req.session.returnTo; //need to delete after assign redirectUrl
    //res.redirect(redirectUrl);
    res.redirect('/records/calendar');
}

module.exports.logout = (req, res) => {
    req.logout();
    //req.flash('success', "GoodBye!");
    res.redirect('/home');
}