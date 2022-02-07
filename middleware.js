const Record = require('./models/record');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    next();
}

module.exports.isRelatedPerson = async(req, res, next) => {
    const { id } = req.params;
    const record = await Record.findById(id);
    if ((!record.author.equals(req.user._id)) && (!record.payer.equals(req.user._id))) {
        return res.redirect(`/records/${id}`)
    }
    next();
}