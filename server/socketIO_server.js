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
  io.on('connection', function (socket) {
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

    socket.on('online', ({userId, sessionID}) => {
      console.log(sessionID);
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
          data.sender = senderId
        }
        let msgId = await Message.createNew(data);
        io.to(sessionID).emit('receivePrivateMsg', { 
          messageId: msgId.id,
          senderName: senderName,
          senderId: senderId
        })
        // console.log(onlineUsers[receiverId]);
        // console.log(onlineUsersSessions.get(onlineUsers[receiverId]))
        if(onlineUsers[receiverId] && onlineUsersSessions.get(onlineUsers[receiverId])){
          console.log(receiverId, "online")
          let reveiverSessionId = onlineUsers[receiverId];
          io.to(reveiverSessionId).emit('receivePrivateMsg', { 
            messageId: msgId.id,
            senderName: senderName,
            senderId: senderId
          })
        }
        else{
          console.log(receiverId, "offline")
        }
      })
    })



    // console.log('a user connected')

  })
}