// const sendMsg = require("/chatrooms.socketio_test.js")
// import {sendMsg} from './socketio_test'
$(function () { 
    const $sendMsgError = $('#sendMsgError')
    const $sendMsgText = $('#sendMsgText')
    let roomId = document.location.pathname
    let socket = io.connect(`http://localhost:4000`)
    socket.emit("join", roomId)
    socket.on('receiveMsg', function (data) {
        receiveMsg(data)
      })

    let cookies = document.cookie.split(';')
    let username = '';
    
    for(let i = 0; i < cookies.length; i++){
        let pair = cookies[i].split('=')
        if(pair[0] === 'username'){
            username = pair[1]
            break
        }
    }
    username = username === ""?"Anonymous User": username
    $sendMsgError.hide()
    $sendMsgText.focus(function(){
        $sendMsgError.html("")
        $sendMsgError.hide()
    })
    $('#sendMsgButton').click(function() {
        let msg = $sendMsgText.val()
        
        if(msg === undefined || msg.trim().length === 0){
            $sendMsgError.show()
            $sendMsgError.html("Please write something before send.")
            return;
        }
        socket.emit('sendMsg',{msg, username})
        $sendMsgText.val("")
    })
    function receiveMsg(chat) {
        
        let newCard = `<div class="card ${username === chat.sender? 'myMsg':''}" >
            <div class="card-body">
                <h5 class="card-title">${ chat.sender }</h5>
                <h6 class="card-subtitle mb-2 text-muted">${ new Date(chat.send_time).toLocaleString()}</h6>
                <p class="card-text">${ chat.content}</p>
            </div>
        </div>`
        $('#chatLog').append(newCard);
    }


 })