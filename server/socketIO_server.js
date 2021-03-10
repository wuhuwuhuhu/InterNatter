const { date } = require('joi');

// const {ChatModel} = require('../db/models')
module.exports = function (user, server) {
  //get IO object
  //socket.io v3 requires the cors
  // const io = require('socket.io')(server, {
  //   cors: {
  //     origin: '*',
  //   }
  // })

  
  //listen connection
  const io = require('socket.io')(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });
  io.on('connection', function (socket) {
    

    //  socket.emit('receiveMsg', 'Hi, all Clients. Server received')
    socket.on('join', roomId => {
      socket.join(roomId);

      // translate
      // socket.on("sendMsg", ({msg, senderName, senderLang}) => {
      //   io.to(roomId).emit('receiveMsg', {
      //     Original: msg,
      //     constent: myTranslate(msg, senderLang),
      //     sender: sender.username,
      //     send_time: Date.now()
      //   });
      // })
      // var roster = io.sockets.adapter.rooms.get(roomId);
      // io.to(roomId)
      // io.to(roomId).emit('receiveMsg', "hello")
      socket.on("sendMsg", async ({ msg, senderName, senderLang }) => {
        io.to(roomId).emit('receiveMsg', { 
          originalMsg: msg, 
          senderLang: senderLang, 
          sender: senderName, 
          send_time: Date.now() 
        })
      })
    })



    console.log('a user connected')
    //listen socket
    // socket.on('sendMsg', function({from, to, content}){
    //     console.log('server received: ', {from, to, content})
    //     //process msg
    //     //save chatMsg object
    //     const chat_id = [from, to].sort().join('_')
    //     const create_time = Date.now()
    //     // new ChatModel({from, to, content, chat_id, create_time}).save(function (error, chatMsg) {
    //     //     //send to all clients (not efficient!)
    //     //     io.emit('receiveMsg', chatMsg)
    //     // })
    //     // //send msg to client
    //     // io.emit('receiveMsg', 'Hi, all Clients. Server received' + data)
    //     // //socket.emit('receiveMsg', 'Hi, Client. Server received your' + data) //just send to the socket
    //     // console.log('server send to Client:' + data)
    // })
  })
}