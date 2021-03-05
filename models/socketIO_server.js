// const {ChatModel} = require('../db/models')
module.exports = function (server) {
    //get IO object
    //socket.io v3 requires the cors
    const io = require('socket.io')(server, {
       cors: {
         origin: '*',
       }
     })
    //listen connection
    io.on('connection', function(socket) {
      //  socket.emit('receiveMsg', 'Hi, all Clients. Server received')
        socket.on('join', function(roomId){
          socket.join(roomId);
          // var roster = io.sockets.adapter.rooms.get(roomId);
          // io.to(roomId)
          // io.to(roomId).emit('receiveMsg', "hello")
          socket.on("sendMsg", function({msg, username}){

            io.to(roomId).emit('receiveMsg',{content: msg, sender: username, send_time: Date.now() })
            })
        })

        
        console.log('socketio connected')
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