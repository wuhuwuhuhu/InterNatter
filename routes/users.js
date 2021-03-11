const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const langs = require('../utils/translate/languages')

router.get('/register', (req, res) => {
    res.render('users/register', {langs});
});

router.post('/register', catchAsync(async (req, res, next) => {
    try {
        const { email, username, password, language } = req.body;
        const user = new User({ email, username, language });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', "Welcome to InterNatter");
            res.redirect('/chatrooms');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.get('/profile', (req, res) => {
    res.render('users/profile', {user: req.user});
});

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'Welcome Back!');
    const redirectUrl = req.session.returnTo || '/chatrooms'; 
    delete req.session.returnTo;
    res.redirect(redirectUrl);  // redirect to the page before login
});

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', "Goodbye!");
    res.clearCookie("username");
    res.clearCookie("userLanguage");
    res.redirect('/chatrooms');
});

module.exports = router;