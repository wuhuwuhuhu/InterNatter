const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { chatroomSchema } = require('../schemas.js');
const { isLoggedIn } = require('../middleware');

const ExpressError = require('../utils/ExpressError');
const Chatroom = require('../models/chatroom');

const validateChatroom = (req, res, next) => {
    const { error } = chatroomSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

router.get('/', catchAsync(async (req, res) => {
    const chatrooms = await Chatroom.find({});
    res.render('chatrooms/index', { chatrooms });
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('chatrooms/new');
});

router.post('/', isLoggedIn, validateChatroom, catchAsync(async (req, res, next) => {
    const chatroom = new Chatroom(req.body.chatroom);
    await chatroom.save();
    req.flash('success', "Successfully opened a new chatroom!");
    res.redirect(`/chatrooms/${chatroom._id}`);
}));

router.get('/:id', catchAsync(async (req, res) => {
    const chatroom = await Chatroom.findById(req.params.id);
    if (!chatroom) {
        req.flash('error', 'Cannot find that chatroom');
        return res.redirect('/chatrooms');
    }
    res.cookie('username','whd', {maxAge: 1000*60*60*24*7})
    let data = 	  [
          {
            "sender": "Jerry",
            "content": "Hello.",
            "send_time": 1614907034604
          },
          {
            "sender": "zhao",
            "content": "Nice to meet you.",
            "send_time": 1614907035620
          },
          {
            "sender": "John",
            "content": "Hello.",
            "send_time": 1614907044604
          },
          {
            "sender": "Mike",
            "content": "Nice to meet you.",
            "send_time": 1614907134620
          },
          {
            "sender": "Nicole",
            "content": "Hello.",
            "send_time": 1614907234604
          },
          {
            "sender": "whd",
            "content": "Nice to meet you.",
            "send_time": 1614905034620
          }
        ]
      
    // let username = req.cookie.username
    let username = 'whd'
    res.render('chatrooms/show', { chatroom, data, username });
}));

router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const chatroom = await Chatroom.findById(req.params.id);
    if (!chatroom) {
        req.flash('error', 'Cannot find that chatroom!');
        return res.redirect('/chatrooms');
    }
    res.render('chatrooms/edit', { chatroom });
}));

router.put('/:id', isLoggedIn, validateChatroom, catchAsync(async (req, res) => {
    const { id } = req.params;
    const chatroom = await Chatroom.findByIdAndUpdate(id, { ...req.body.chatroom });
    req.flash('success', "Successfully updated chatroom!");
    res.redirect(`/chatrooms/${chatroom._id}`);
}));

router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Chatroom.findByIdAndDelete(id);
    req.flash('success', "Successfully dismiss the chatroom!");
    res.redirect('/chatrooms');
}));

module.exports = router;