// const sendMsg = require("/chatrooms.socketio_test.js")
// import {sendMsg} from './socketio_test'
$(() => {
    const $sendMsgError = $('#sendMsgError')
    const $sendMsgText = $('#sendMsgText')
    const roomId = document.location.pathname
    const socket = io.connect(`http://localhost:4000`)
    socket.emit("join", roomId)
    socket.on('receiveMsg', data => {
        receiveMsg(data)
    })

    const cookies = document.cookie.split(';')
    let username = '';
    let userLanguage = '';

    for (let i = 0; i < cookies.length; i++) {
        let pair = cookies[i].split('=')
        if (pair[0] === 'username') username = pair[1];
        if (pair[0] === 'userLanguage') userLanguage = pair[1];
    }
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
        socket.emit('sendMsg', { msg, senderName: username, senderLang: $("#senderLanguage").val() })
        $sendMsgText.val("")
    })

    $('#clearMsgButton').click(() => {
        $("#sendMsgText").val("");
    })

    const receiveMsg = async chat => {
        let newCard = `<div class="card ${username === chat.sender ? 'myMsg' : ''}" >
            <div class="card-body">
                <h5 class="card-title">${chat.sender}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${new Date(chat.send_time).toLocaleString()}</h6>
                <p class="card-text">Original: ${chat.originalMsg} (lang: ${chat.senderLang})</p>
                <p class="card-text"> (Translation will show here.) </p>
            </div>
        </div>`
        $('#chatLog').append(newCard);
    }


})