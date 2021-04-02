// const sendMsg = require("/chatrooms.socketio_test.js")
// import {sendMsg} from './socketio_test'
$(() => {
    const $sendMsgError = $('#sendMsgError')
    const $sendMsgText = $('#sendMsgText')
    const roomId = document.location.pathname.match(/[0-9a-fA-F]{24}/)[0]
    const socket = io.connect(`http://localhost:4000`)
    /*
    if you want to test on another device, change the ip to your server ip.
    for example:
    const socket = io.connect(`http://192.168.31.59:4000`)
    for deployment at ECS:
    const socket = io('http://104.194.73.106:4000')
    */
    socket.on('connect', function() {
        const sessionID = socket.id;
        if(!username){
            username = "Anonymous_User_" + sessionID.slice(0,8);
        }
    })
    socket.emit("join", roomId)
    socket.on('receiveMsg', ({messageId, senderName}) => {
    $.get("/chatrooms/getMessage", {messageId, senderName, userLanguage}, function (responseMessage) {
            receiveMsg(responseMessage) 
        });
    })
    

    const cookies = document.cookie.split(';')
    //Set default language and user name to prevent bad data
    let username = '';
    let userLanguage = '';
    let userId = '';
    for (let i = 0; i < cookies.length; i++) {
        let pair = cookies[i].split('=')
        if (pair[0].trim() === 'username') username = decodeURI(pair[1]);
        if (pair[0].trim() === 'userLanguage') userLanguage = decodeURI(pair[1]);
        if (pair[0].trim() === 'userId') userId = decodeURI(pair[1]).match(/[0-9a-fA-F]{24}/)[0];
    }
    if(!userLanguage){
        userLanguage = "English";
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
        
        socket.emit('sendMsg', { msg, senderId: userId, senderName: username, senderLang: userLanguage})
        $sendMsgText.val("")
    })

    $('#clearMsgButton').click(() => {
        $sendMsgText.val("");
    })

    const receiveMsg = async chat => {

        let newCard;
        if(username === chat.senderName){
            newCard = `<div class="card myMsg">
                            <div class="row">
                                <div class="col-md-10">
                                    <div class="card-body">
                                        <h6 class="card-subtitle mb-2 text-muted">
                                            ${chat.sendTime.toLocaleString()}
                                        </h6>
                                        <p class="card-text">
                                            Original: ${chat.originalMsg} (Language: ${ decodeURI(chat.originalLanguage)})
                                        </p>
                                        <p class="card-text">
                                            ${chat.translatedMsg}
                                        </p>
                                    </div>
                                </div>
                                <div class="col-md-2 sendInfo">
                                    <img class="img-fluid" alt="" src="/images/avatars/test_user.png" style="padding-top: auto 1px;">
                                    <h5 class="card-title">
                                        ${chat.senderName}
                                    </h5>
                                </div>         
                            </div>
            
                        </div>`
        }else{
            newCard = `<div class="card">
                            <div class="row">
                                <div class="col-md-2 sendInfo">
                                    <img class="img-fluid" alt="" src="/images/avatars/test_user.png" style="padding-top: auto 1px;">
                                    <h5 class="card-title">
                                        ${chat.senderName}
                                    </h5>
                                </div> 
                                <div class="col-md-10">
                                    <div class="card-body">
                                        <h6 class="card-subtitle mb-2 text-muted">
                                            ${chat.sendTime.toLocaleString()}
                                        </h6>
                                        <p class="card-text">
                                            Original: ${chat.originalMsg} (Language: ${ decodeURI(chat.originalLanguage)})
                                        </p>
                                        <p class="card-text">
                                            ${chat.translatedMsg}
                                        </p>
                                    </div>
                                </div>        
                            </div>
            
                        </div>`
        } 
        $('#chatLog').append(newCard);
    }

    const $emojis = $('#emojis');
    const $emoji = $('.emoji');
    $emojis.hide();
    $('#buttonEmoji').click(() => {
        $emojis.slideToggle();
    })

    $emojis.click((event) => {
        let value = event.target.innerHTML
        $sendMsgText.val($sendMsgText.val() + value); 
    })

})