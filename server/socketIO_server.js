const Message = User = require('../models/message');

module.exports = function (user, server) {
  const io = require('socket.io')(server, {
    cors: {
      origin: "*",
      //accept request from all ip
      methods: ["GET", "POST"]
    }
  });
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
          data.sender = senderId
        }
        let msgId = await Message.createNew(data);
        io.to(roomId).emit('receiveMsg', { 
          messageId: msgId.id,
          senderName: senderName
        })
      })
    })



    console.log('a user connected')

  })
}