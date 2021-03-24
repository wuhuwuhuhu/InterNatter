const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const friendList = require('../models/friendlist')
const langs = require('../utils/translate/languages')
var friends = require("mongoose-friends")

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
            res.cookie('username', req.user.username, { maxAge: 1000 * 60 * 60 * 24 * 7 })
            res.cookie('userLanguage', req.user.language, { maxAge: 1000 * 60 * 60 * 24 * 7 })
            res.cookie('userId', JSON.stringify(req.user._id), { maxAge: 1000 * 60 * 60 * 24 * 7 })
            req.flash('success', "Welcome to InterNatter");
            res.redirect('/chatrooms');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}));


router.post('/profile', catchAsync(async (req, res, next)=>{
    

    const user = await User 
    

    user.findById(req.body.friendlist, async function(err, result) {
        if (err) {
          console.log(req.body.friendlist +"Error: user doesnt exist");
          res.redirect("profile")
        } else {
            var newfriend = await user.findById(req.body.friendlist)

            if(newfriend !=null){

                var friendlist = await friendList

                var friendinlist  = await friendlist.exists({userId:req.user._id, friendId:newfriend._id})

                if(friendinlist){
                    console.log("user already in friendlist")
                }
                else{
                        var friend = new friendList({userId:req.user._id, username: req.user.username,friendId:newfriend._id,friendname:newfriend.username })
                            
                        friend.save(function (err, friend) {
                            if (err) return console.error(err);
                            console.log(newfriend.username+" added to friendlist.");
                        });
                }
                    
            }
             else{
                console.log('error:invalid input')
            }
                
            res.redirect("profile")     
        }
      });

}))

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.get('/profile',catchAsync(async (req, res) => {

    const friendlist = await friendList

    friendlist.find({friendId:req.user._id}, function(err, data){
        if(err){
            console.log(err);
            return
        }
    
        if(data.length == 0) {
            console.log("No record found")
            res.render('users/profile', {user: req.user,friend: data})
            return
        }
        for(i = 0;i<data.length;i++){
        console.log(data[i].username);
        console.log(data[i].userId)
    }
        res.render('users/profile', {user: req.user, friend: data})
    })
    //const friendrequest = friendlist.find({friendId:req.user._id })
    //console.log(friendrequest.username)
    

    
}));

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    res.cookie('username', req.user.username, { maxAge: 1000 * 60 * 60 * 24 * 7 })
    res.cookie('userLanguage', req.user.language, { maxAge: 1000 * 60 * 60 * 24 * 7 })
    res.cookie('userId', JSON.stringify(req.user._id), { maxAge: 1000 * 60 * 60 * 24 * 7 })
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
    res.clearCookie("userId");
    res.redirect('/chatrooms');
});

module.exports = router;