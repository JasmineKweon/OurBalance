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
            req.flash('success', 'Welcome to OurBalance!');
            res.redirect('/records/calendar');
        })
    } catch (e) {
        res.redirect('/register');
    }
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome Back!');
    res.redirect('/records/calendar');
}

module.exports.logout = (req, res) => {
    req.logout();
    res.redirect('/');
}