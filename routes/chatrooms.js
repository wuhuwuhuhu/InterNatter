const express = require('express');
const detect = require('detect-port');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { chatroomSchema } = require('../schemas.js');
const { isLoggedIn } = require('../middleware');
const translator = require('../utils/translate/translate').translate;
const ExpressError = require('../utils/ExpressError');
const Chatroom = require('../models/chatroom');
const Message = require('../models/message');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

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

router.post('/', isLoggedIn, upload.array('image'), validateChatroom, catchAsync(async (req, res, next) => {
  const chatroom = new Chatroom(req.body.chatroom);
  chatroom.creator = req.user._id;
  chatroom.image = req.files[0].path;
  // chatroom.image.filename = req.files[0].filename;
  await chatroom.save();
  req.flash('success', "Successfully opened a new chatroom!");
  res.redirect(`/chatrooms/${chatroom._id}`);
}));

router.get('/getMessage', async(req, res) => {
  
  let {messageId ,senderName, userLanguage} = req.query;
  let response = await Message.getMessage(messageId, senderName, userLanguage);
  return res.json(response);
});

router.get('/:id', catchAsync(async (req, res) => {
  const chatroom = await Chatroom.findById(req.params.id).populate('creator');
  if (!chatroom) {
    req.flash('error', 'Cannot find that chatroom');
    return res.redirect('/chatrooms');
  }
  const username = req.user === undefined ? 'Anonymous User' : req.user.username;
  const userLanguage = req.user === undefined ? "English" : req.user.language;

  const data = await Message.getChatroomLog(chatroom.id, userLanguage)
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

router.put('/:id', isLoggedIn, upload.array('image'), validateChatroom, catchAsync(async (req, res) => {
  const { id } = req.params;
  const chatroom = await Chatroom.findByIdAndUpdate(id, { ...req.body.chatroom });
  if (req.files.length !== 0) {
    chatroom.image = req.files[0].path;
    // chatroom.image.filename = req.files[0].filename;
    await chatroom.save();
  }
  req.flash('success', "Successfully updated chatroom!");
  res.redirect(`/chatrooms/${chatroom._id}`);
}));

router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
  const { id } = req.params;
  await Chatroom.findByIdAndDelete(id);
  await Message.deleteMany({receiver: id })
  req.flash('success', "Successfully dismiss the chatroom!");
  res.redirect('/chatrooms');
}));

module.exports = router;