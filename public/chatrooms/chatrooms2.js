// const sendMsg = require("/chatrooms.socketio_test.js")
// import {sendMsg} from './socketio_test'
$(() => {
    // const server = require('http').createServer(app);
    // require('./server/socketIO_server')(server);
    server.listen(4000, () => {
        console.log("Serving on port 4000");
    })

    const io = require('socket.io')(server)

    // const {username, userLanguage} = require('../../utils/readCookie')
    const $sendMsgError = $('#sendMsgError')
    const $sendMsgText = $('#sendMsgText')
    const roomId = document.location.pathname
    let socket = io.connect(`http://localhost:4000`)
    socket.emit("join", roomId)
    socket.on('receiveMsg', data => {
        receiveMsg(data)
    })

    $sendMsgError.hide()
    $sendMsgText.focus(function () {
        $sendMsgError.html("")
        $sendMsgError.hide()
    })

    $('#sendMsgButton').click(function () {
        let msg = $sendMsgText.val()

        if (msg === undefined || msg.trim().length === 0) {
            $sendMsgError.show()
            $sendMsgError.html("Please write something before send.")
            return;
        }
        socket.emit('sendMsg', { msg, senderName: username, senderLang: userLanguage})
        $sendMsgText.val("")
    })

    $('#clearMsgButton').click(() => {
        $("#sendMsgText").val("");
    })

    const receiveMsg = chat => {

        let newCard = `<div class="card ${username === chat.sender ? 'myMsg' : ''}" >
            <div class="card-body">
                <h5 class="card-title">${chat.sender}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${new Date(chat.send_time).toLocaleString()}</h6>
                <p class="card-text">Original: ${chat.originalMsg} (lang: ${chat.senderLang})</p>
                <p class="card-text"> ${chat.translation}</p>
            </div>
        </div>`
        $('#chatLog').append(newCard);
    }


})