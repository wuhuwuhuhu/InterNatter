module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl; // save the current url
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}