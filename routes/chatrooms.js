const express = require('express');
const detect = require('detect-port');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { chatroomSchema } = require('../schemas.js');
const { isLoggedIn } = require('../middleware');
const translator = require('../utils/translate/translate').translate;
const ExpressError = require('../utils/ExpressError');
const Chatroom = require('../models/chatroom');

const validateChatroom = (req, res, next) => {
  const { error } = chatroomSchema.validate(req.body);
  if (error) {
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

router.post('/translate',catchAsync(async(req, res) => {
  let {originalMsg, senderLang, userLanguage} = req.body
  let response = await translator({text: originalMsg, from: senderLang, to: userLanguage})
  res.json(response)
}));

router.get('/:id', catchAsync(async (req, res) => {
  const chatroom = await Chatroom.findById(req.params.id);
  if (!chatroom) {
    req.flash('error', 'Cannot find that chatroom');
    return res.redirect('/chatrooms');
  }
  // res.cookie('username','JJ', {maxAge: 1000*60*60*24*7})

  const username = req.user === undefined ? 'Anonymous' : req.user.username;
  const userLanguage = req.user === undefined ? 'en' : req.user.language;
  res.cookie('username', username, { maxAge: 1000 * 60 * 60 * 24 * 7 })
  res.cookie('userLanguage', userLanguage, { maxAge: 1000 * 60 * 60 * 24 * 7 })
  const data = [
    {
      "sender": "Jerry",
      "originalMsg": "Hello.",
      "send_time": 1614907034604,
      "senderLang": "en"
    },
    {
      "sender": "zhao",
      "originalMsg": "Nice to meet you.",
      "send_time": 1614907035620,
      "senderLang": "en"
    },
    {
      "sender": "John",
      "originalMsg": "Hello.",
      "send_time": 1614907044604,
      "senderLang": "en"
    },
    {
      "sender": "Mike",
      "originalMsg": "Nice to meet you.",
      "send_time": 1614907134620,
      "senderLang": "en"
    },
    {
      "sender": "Nicole",
      "originalMsg": "Hello.",
      "send_time": 1614907234604,
      "senderLang": "en"
    },
    {
      "sender": "whd",
      "originalMsg": "Nice to meet you.",
      "send_time": 1614905034620,
      "senderLang": "en"
    }
  ]
  for(let i = 0; i < data.length; i++){
    let msg = data[i]
    if(userLanguage != msg.senderLang)
    {
      let response = await translator({text: msg.originalMsg, from: msg.senderLang, to: userLanguage})
      msg.translatedMsg = response.text
    }else{
      msg.translatedMsg = msg.originalMsg;
    }

  }
  // check if the server is on
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
      console.log(`port: ${port} was in use`);
    }
  });


  res.render('chatrooms/show', { chatroom, data, username, userLanguage });
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