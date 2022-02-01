//const User = require('../models/user');

module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register');
}

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login');
}

// module.exports.register = async(req, res) => {
//     const { email, username, password } = req.body;
//     console.log("---------------------------------------");
//     console.log(email);
//     console.log(username);
//     console.log(password);
//     console.log("---------------------------------------");
//     const user = new User({ email, username, password });
//     console.log(user);

//     try {
//         const { email, username, password } = req.body;
//         const user = new User({ email, username });
//         const registeredUser = await User.register(user, password);
//         req.login(registeredUser, err => {
//             if (err) return next(err);
//             res.redirect('/');a
//         })
//     } catch (e) {
//         res.redirect('/regiester');
//     }
// }

// module.exports.login = (req, res) => {
//     const redirectUrl = req.session.returnTo || '/campgrounds';
//     delete req.session.returnTo; //need to delete after assign redirectUrl
//     res.redirect(redirectUrl);
// }