const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const friendList = require('../models/friendlist')
const langs = require('../utils/translate/languages')
const userFriends =  require('../models/friend')
const detect = require('detect-port');
const Message = require('../models/message');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const {utilsTranslator, navUtilsTranslator} = require('./utilsTranslators')

function openChatPort(req) {
    const port = 4000;
      detect(port, (err, _port) => {
        if (err) {
          console.log(err);
        }
      
        if (port == _port) {
          const app = express();
          const server = require('http').createServer(app);
          require('../server/socketIO_server')(req.user, server);
          server.listen(4000, () => {
            console.log("Serving on port 4000");
          })
          // console.log(`port: ${port} was not occupied`);
        } else {
        //   console.log(`port: ${port} was in use`);
        }
      });
    }

router.get('/', async (req, res) => {
    let names = await navUtilsTranslator(req, res);
    let specialNames = await utilsTranslator(req, res, ["Connect Globally. Chat Globally."])
    names = {
        ...names,
        ...specialNames
    }
    res.render('home', {names});

    });

router.post('/utilsTranslator', async (req, res) => {
    const {names} = req.body;
    res.json(await utilsTranslator(req, res, names))
});

router.get('/register', async (req, res) => {
    res.redirect('/register/English');
});

router.get('/register/:language', async (req, res) => {
    const language = decodeURI(req.params.language);
    let names = await navUtilsTranslator(req, res, language);
    let specialNames = await utilsTranslator(req, res, ["Register","Language", "Looks good!", "Username", "Email", "Password","Input Password Again","Choose a profile image","Browse","Register"], language);
    names = {
        ...names,
        ...specialNames
    }
    res.render('users/register', {language, langs, names});
});

router.post('/register', upload.array('image'), catchAsync(async (req, res, next) => {
    try {
        const { email, username, password, language } = req.body;
        const user = new User({ email, username, language });
        //check whether user didn't upload image, if not use the default one
        if(req.files && req.files[0] && req.files[0].path){
            user.image = req.files[0].path;
        }else{
            user.image = '/images/avatars/default_avatar.png';
        }
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            res.cookie('username', req.user.username, { maxAge: 1000 * 60 * 60 * 24 * 7 })
            res.cookie('userLanguage', req.user.language, { maxAge: 1000 * 60 * 60 * 24 * 7 })
            res.cookie('userId', JSON.stringify(req.user._id), { maxAge: 1000 * 60 * 60 * 24 * 7 })
            openChatPort(req);
            req.flash('success', "Welcome to InterNatter");
            res.redirect('/chatrooms');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}));

router.post('/users/search', catchAsync(async (req, res, next)=>{
    const keyword = req.body.keyword;
    let reg = new RegExp(`${keyword}`,"ig");
    const results = await User.find({$or:[{"username": reg},{"email": reg}]},(err, doc)=>{
    });
    return res.json(results);
}))

router.post('/users/addFriend', catchAsync(async (req, res, next)=>{
    
    const {userId, friendId} = req.body;
    if(userId === friendId){
        return res.json({status:1, msg:"Error: can not add your self."});
    }
    let user = await User.findById(userId);
    let friend = await User.findById(friendId);
    if(!user || !friend){
        return res.json({status:1, msg:"Error: user doesnt exist."});
    }
    let friendinPendinglist  = await friendList.find({userId, friendId},(err, doc)=>{
        console.log(err)
    })
    let friendinlist = await userFriends.find({userId, friendId});
    if(friendinlist.length != 0){
        return res.json({status:1, msg:"User already in friendlist."});
    }
    if(friendinPendinglist.length != 0){
        return res.json({status:1, msg:"You are in pending list."});
    }
    let friendConnection = new friendList({userId, username: user.username, friendId,friendname: friend.username })
                            
    friendConnection.save(function (err, friend) {
        if (err) {
            return res.json({status:1, msg:"Can not add"})
        }
    });
    return res.json({status:0, data: friendConnection});

}))

router.post('/users/getPendingList', catchAsync(async (req, res, next)=>{
    
    const {userId} = req.body;
    let user = await User.findById(userId);
    if(!user){
        return res.json({status:1, msg:"Error: user doesn't exist"});
    }
    let friendinPendinglist  = await friendList.find({friendId: userId},(err, doc)=>{
        console.log(err)
    })
    let r = [];
    for(i = 0;i<friendinPendinglist.length;i++){
        let userId = friendinPendinglist[i].userId;
        let pendingUser = await User.findById(userId);
        r.push({
            userId: pendingUser.id,
            username: pendingUser.username,
            userImage: pendingUser.image
        })

    }
    return res.json({status:0, data: r});

}))

router.get('/login', async (req, res) => {
    res.redirect('/login/English');
});

router.get('/login/:language', async (req, res) => {
    const language = decodeURI(req.params.language);
    let names = await navUtilsTranslator(req, res, language);
    let specialNames = await utilsTranslator(req, res, ["Login","Language","Looks good!" ,"Username","Password"], language);
    names = {
        ...names,
        ...specialNames
    }
    res.render('users/login', {language, langs, names});
});

router.get('/profile',catchAsync(async (req, res) => {
    let names = await navUtilsTranslator(req, res);
    let specialNames = await utilsTranslator(req, res,
         ["PROFILE","Username", "Email", "Language", req.user.language]);
    names = {
        ...names,
        ...specialNames
    }
    res.render('users/profile', {user: req.user, names})
}));

router.post('/users/friendRequestProcess', catchAsync(async (req, res, next)=>{
    let {accept, userId, friendId, username, friendname} = req.body;

    if(accept == "true"){
        var arr = [{userId: friendId,username:friendname, friendId: userId, friendname:username}, {userId: userId,username:username, friendId: friendId, friendname:friendname}]
        await userFriends.insertMany(arr,function (err, friend) {
            if (err) return console.error(err);
            console.log(username +" is now your friend ");
          }); 
        

          await friendList.remove({$or:[{"userId": userId,"friendId": friendId}, {"userId": friendId,"friendId": userId}]}, function(err, result){
              if(err){
                  res.send(err)
              }
              else{
                  console.log(userId + ", " + friendId +" is deleated")
              }
          })
          return res.send({code: 0})
    }
    if(accept == "false"){
        console.log(username + "did not accept your friend request ")
        await friendList.remove({$or:[{"userId": userId,"friendId": friendId}, {"userId": friendId,"friendId": userId}]}, function(err, result){
            if(err){
                res.send(err)
            }
            else{
                console.log(userId + ", " + friendId +" is deleated")
            }
        })
        return res.send({code: 1})
    }

    
    /*
    accept : true / false
    */
    console.log("get friendRequestProcess request", req.body);
}));
router.post('/users/getPrivateMessages', catchAsync(async (req, res, next)=>{
    let {userId, friendId} = req.body;
    let response = await Message.getPrivateChatLog({userId, friendId});
    return res.json(response);
}));
router.get('/friend',catchAsync(async (req, res) => {
    const userfriend = await userFriends
    let names = await navUtilsTranslator(req, res);
    let specialNames = await utilsTranslator(req, res, ["Friends","Add Friend", "Search", "Name or Email", "Pending List", "Send Message","Use Emojis","Send","Clear", "Type here..."]);
    names = {
        ...names,
        ...specialNames
    }
    let friends = await userfriend.find({userId:req.user._id}, function(err, data2){
        if(err){
            console.log(err);
            return
        }})
    
        if(friends.length == 0) {
            console.log("No record found")
            res.render('users/friend', {user: req.user,friends: friends, names})
            return
        }
        for(i = 0;i<friends.length;i++){
            let friendId = friends[i].friendId;
            let friend = await User.findById(friendId);
            if(friend){
                friends[i].friendImage = friend.image;
            }
        // console.log(data2[i].username);
        // console.log(data2[i].userId)
        }
      // check if the server is on
      openChatPort(req);

      res.render('users/friend', {user: req.user,  friends: friends, names})
        
    

}));

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    res.cookie('username', req.user.username, { maxAge: 1000 * 60 * 60 * 24 * 7 })
    res.cookie('userLanguage', req.user.language, { maxAge: 1000 * 60 * 60 * 24 * 7 })
    res.cookie('userId', JSON.stringify(req.user._id), { maxAge: 1000 * 60 * 60 * 24 * 7 })
    openChatPort(req);
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