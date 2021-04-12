$(() => {
    let username = '';
    let userLanguage = '';
    let userId = '';
    let socket = null;
    init();
    if(username !== ''){
        createChat()
    }
    function init() {

        const cookies = document.cookie.split(';')
        for (let i = 0; i < cookies.length; i++) {
            let pair = cookies[i].split('=')
            if (pair[0].trim() === 'username') username = decodeURI(pair[1]);
            if (pair[0].trim() === 'userLanguage') userLanguage = decodeURI(pair[1]);
            if (pair[0].trim() === 'userId') userId = decodeURI(pair[1]).match(/[0-9a-fA-F]{24}/)[0];
        }
        //Set default language and user name to prevent bad data
        if (!userLanguage) {
            userLanguage = "English";
        }
    }

    function createChat(receiverID) {
        if (socket) {
            socket.close();
        }
        socket = io.connect(`http://localhost:4000`)
        
        /*
        if you want to test on another device, change the ip to your server ip.
        for example:
        const socket = io.connect(`http://192.168.31.59:4000`)
        for deployment at ECS:
        socket = io.connect('http://104.194.73.106:4000')
        */
        socket.on('connect', function () {
            const sessionID = socket.id;
            if (!username) {
                username = "Anonymous_User_" + sessionID.slice(0, 8);
            }
            socket.emit("connect_notifications", {
                userId,
                sessionID
            });
            console.log('send')
        })

        socket.on('receivePrivateMsg', ({
            messageId,
            senderName
        }) => {
            $.get("/chatrooms/getMessage", {
                messageId,
                senderName,
                userLanguage
            }, function (responseMessage) {
                //don't show whether at private chat page with this friend
                let friendName = $('#currentChatFriend').text();
                if (responseMessage.senderName === friendName ||
                     responseMessage.senderName === username) {
                         return;
                     }
                let {
                    translatedMsg,
                    portrait,
                    sendTime,
                    senderName
                } = responseMessage;
                const $toast = $(`        
                <div class="toast" role="alert" aria-live="assertive" aria-atomic="true" data-delay="3000";>
                    <div class="toast-header">
                        <img src="${portrait}" class="rounded mr-2" alt="${senderName}">
                        <strong class="mr-auto">${senderName}</strong>
                        <small>${new Date(sendTime).toLocaleTimeString()}</small>
                        <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="toast-body">
                        ${translatedMsg}
                    </div>
              </div>`);
              $('#toasts').append($toast);
              $toast.toast('show');
                // receivePrivateMsg(responseMessage);
            });
        })
    }
})