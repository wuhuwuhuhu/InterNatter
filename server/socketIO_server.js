const Message = require('../models/message');
const User = require('../models/user');

module.exports = function (user, server) {
  const io = require('socket.io')(server, {
    cors: {
      origin: "*",
      //accept request from all ip
      methods: ["GET", "POST"]
    }
  });
  const onlineUsers = {};
  const onlineUsersSessions = io.sockets.sockets;
  const onlineUsers_notification = {};
  const onlineUsersSessions_notification  = io.sockets.sockets;
  io.on('connection', function (socket) {
    //group chat
    socket.on('join', roomId => {
      socket.join(roomId);
      socket.on("sendMsg", async ({ msg, senderId, senderName, senderLang }) => {
        const data = {
          receiver: roomId,
          senderName: senderName,
          content: msg,
          originalLanguage: senderLang     
        }
        if(senderId){
          data.sender = senderId;
          const user = await User.findById(senderId);
          data.portrait = user.image;
        }
        let msgId = await Message.createNew(data);
        io.to(roomId).emit('receiveMsg', { 
          messageId: msgId.id,
          senderName: senderName
        })
      })
    })

    //private chat
    socket.on('online', ({userId, sessionID}) => {
      // console.log(sessionID);
      onlineUsers[userId] = sessionID;
      //a new user requested the friend page
      socket.on("sendPrivateMsg", async ({ msg, senderId, receiverId, senderName, senderLang }) => {
        
        const data = {
          receiver: receiverId,
          senderName: senderName,
          content: msg,
          originalLanguage: senderLang     
        }
        if(senderId){
          data.sender = senderId;
          let senderObj = await User.findById(senderId);
          data.portrait = senderObj.image;
        }
        let msgId = await Message.createNew(data);
        io.to(sessionID).emit('receivePrivateMsg', { 
          messageId: msgId.id,
          senderName: senderName,
          senderId: senderId,
          portrait:data.portrait
        })
        // console.log(onlineUsers[receiverId]);
        // console.log(onlineUsersSessions.get(onlineUsers[receiverId]))
        if(onlineUsers[receiverId] && onlineUsersSessions.get(onlineUsers[receiverId])){
          // console.log(receiverId, "online")
          let reveiverSessionId = onlineUsers[receiverId];
          io.to(reveiverSessionId).emit('receivePrivateMsg', { 
            messageId: msgId.id,
            senderName: senderName,
            senderId: senderId
          })
        }
        else{
          // console.log(receiverId, "offline")
        }

        if(onlineUsers_notification[receiverId] && onlineUsersSessions.get(onlineUsers_notification[receiverId])){
          // console.log(receiverId, "online")
          let reveiverSessionId = onlineUsers_notification[receiverId];
          io.to(reveiverSessionId).emit('receivePrivateMsg', { 
            messageId: msgId.id,
            senderName: senderName,
            senderId: senderId
          })
        }
        else{
          // console.log(receiverId, "offline")
        }
      })
    })
    
    //used to send toast when get new msg

    socket.on('connect_notifications', ({userId, sessionID}) => {
      // console.log(sessionID);
      onlineUsers_notification[userId] = sessionID;
      //a new user requested the friend page
      socket.on("sendPrivateMsg", async ({ msg, senderId, receiverId, senderName, senderLang }) => {
        
        const data = {
          receiver: receiverId,
          senderName: senderName,
          content: msg,
          originalLanguage: senderLang     
        }
        if(senderId){
          data.sender = senderId;
          let senderObj = await User.findById(senderId);
          data.portrait = senderObj.image;
        }
        let msgId = await Message.createNew(data);
        io.to(sessionID).emit('receivePrivateMsg', { 
          messageId: msgId.id,
          senderName: senderName,
          senderId: senderId,
          portrait:data.portrait
        })
        // console.log(onlineUsers[receiverId]);
        // console.log(onlineUsersSessions.get(onlineUsers[receiverId]))
        if(onlineUsers_notification[receiverId] && onlineUsersSessions_notification.get(onlineUsers_notification[receiverId])){
          // console.log(receiverId, "online")
          let reveiverSessionId = onlineUsers_notification[receiverId];
          io.to(reveiverSessionId).emit('receivePrivateMsg', { 
            messageId: msgId.id,
            senderName: senderName,
            senderId: senderId
          })
        }
        else{
          // console.log(receiverId, "offline")
        }
      })
    })



    // console.log('a user connected')

  })
}