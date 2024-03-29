// const sendMsg = require("/chatrooms.socketio_test.js")
// import {sendMsg} from './socketio_test'
$(() => {
    const $sendMsgError = $('#sendMsgError')
    const $sendMsgText = $('#sendMsgText')
    const $friendListItem = $('.friendListItem')
    const $friendChat = $('#friendChat')
    const $chatLog = $('#chatLog')
    const $currentChatFriend = $('#currentChatFriend');
    const $toggleAddFriend = $('#toggleAddFriend');
    const $togglePendingList = $('#togglePendingList');
    const $toggleAddFriendList = $('#toggleAddFriendList')
    const $searchUserButton = $('#searchUserButton')
    const errorUtilsList = ["Error: can not add your self.", "Error: user doesnt exist.", "User already in friendlist.","You are in pending list.", "Can not add"];
    const utilsList = [...errorUtilsList, "No Pending Request.", "Failed", "Pending", "Add", "Accept", "Reject", "Accepted", "Rejected", "Please write something before send."];
    let utilsMap = {};
    let username = '';
    let userLanguage = '';
    let userId = '';
    let socket = null;
    let receiverId = undefined;
    init();

    $friendListItem.children('a').click((event) => {
        event.preventDefault();
        let $currentDiv = $(event.currentTarget.parentNode);
        let friendId = $currentDiv.attr("friendId");
        const data = {
            userId,
            friendId
        }
        receiverId = friendId;
        createChat(friendId);
        $currentDiv.find(".badge").text("");
        $currentChatFriend.text($currentDiv.attr("friendName"))
        $.post("/users/getPrivateMessages", data, function (data) {
            createChatLog(data);
        });
    })


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
        $.post("/utilsTranslator", {names: utilsList}, function(data){
            utilsMap = data;
        })
        $sendMsgError.hide()
        $friendChat.hide()
        $toggleAddFriend.hide();
        $togglePendingList.hide();
        $sendMsgText.focus(function () {
            $sendMsgError.html("")
            $sendMsgError.hide()
        })
    }
    function getUtilsMap(key){
        if(utilsMap[key]) return utilsMap[key];
        return key;
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
            socket.emit("online", {
                userId,
                sessionID
            })
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
                receivePrivateMsg(responseMessage);
            });
        })
    }

    function createChatLog(data) {
        $chatLog.empty();
        scrollTo(0,0);
        for (let i = 0; i < data.length; i++) {
            const chat = data[i];
            const $card = $(` 
            <div class="card ${ username === chat.senderName? 'myMsg':''}">
                <div class="row">
                    <div class="col-md-10">
                        <div class="card-body">
                            <h6 class="card-subtitle mb-2 text-muted">
                                ${ new Date(chat.sendTime).toLocaleString()}
                            </h6>
                            <p class="originalData card-text" style="display: none;">
                                Original: ${chat.originalMsg} (Language: ${decodeURI(chat.originalLanguage)})
                            </p>
                            <p class="card-text">
                                ${chat.translatedMsg}
                            </p>
                        </div>

                    </div>
                </div>
            </div>`);
            const $senderInfo = $(`
            <div class="col-md-2 sendInfo">
                <img class="img-fluid" alt="" src="${chat.portrait?chat.portrait:"/images/avatars/default_avatar.png"}" style="padding-top: auto 1px;">
                <h5 class="card-title">
                    ${ chat.senderName }
                </h5>
            `)
            if (username === chat.senderName) {
                $senderInfo.appendTo($card.find('.row'));
            } else {
                $senderInfo.prependTo($card.find('.row'));
            }
            $card.appendTo($chatLog);
        }
        $friendChat.show()
    }







    $('#sendMsgButton').click(function () {
        let msg = $sendMsgText.val()

        if (msg === undefined || msg.trim().length === 0) {
            $sendMsgError.show()
            $sendMsgError.html(`${getUtilsMap("Please write something before send.")}`)
            return;
        }

        socket.emit('sendPrivateMsg', {
            msg,
            senderId: userId,
            receiverId,
            senderName: username,
            senderLang: userLanguage
        })
        $sendMsgText.val("")
    })

    $('#clearMsgButton').click(() => {
        $sendMsgText.val("");
    })

    const receivePrivateMsg = async chat => {
        let friendName = $currentChatFriend.text();
        if (chat.senderName !== friendName && chat.senderName !== username) {
            let $MsgSenderDiv = $('#friendList').find(`[friendname=${chat.senderName}]`);
            let badgeNumber = $MsgSenderDiv.find(".badge").text();
            if (!badgeNumber) {
                $MsgSenderDiv.find(".badge").text("1");
            } else {
                $MsgSenderDiv.find(".badge").text(Number(badgeNumber) + 1);
            }
            return;
        }
        let newCard;
        if (username === chat.senderName) {
            newCard = `<div class="card myMsg">
                            <div class="row">
                                <div class="col-md-10">
                                    <div class="card-body">
                                        <h6 class="card-subtitle mb-2 text-muted">
                                            ${new Date(chat.sendTime).toLocaleString()}
                                        </h6>
                                        <p class="originalData card-text" style="display: none;">
                                            Original: ${chat.originalMsg} (Language: ${ decodeURI(chat.originalLanguage)})
                                        </p>
                                        <p class="card-text">
                                            ${chat.translatedMsg}
                                        </p>
                                    </div>
                                </div>
                                <div class="col-md-2 sendInfo">
                                    <img class="img-fluid" alt="" src="${chat.portrait?chat.portrait:"/images/avatars/default_avatar.png"}" style="padding-top: auto 1px;">
                                    <h5 class="card-title">
                                        ${chat.senderName}
                                    </h5>
                                </div>         
                            </div>
            
                        </div>`
        } else {
            newCard = `<div class="card">
                            <div class="row">
                                <div class="col-md-2 sendInfo">
                                    <img class="img-fluid" alt="" src="${chat.portrait?chat.portrait:"/images/avatars/default_avatar.png"}" style="padding-top: auto 1px;">
                                    <h5 class="card-title">
                                        ${chat.senderName}
                                    </h5>
                                </div> 
                                <div class="col-md-10">
                                    <div class="card-body">
                                        <h6 class="card-subtitle mb-2 text-muted">
                                            ${new Date(chat.sendTime).toLocaleString()}
                                        </h6>
                                        <p class="originalData card-text" style="display: none;">
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

    //add friend
    $('#toggleAddFriendButton').click((event) => {
        event.preventDefault();
        $toggleAddFriendList.empty();
        $toggleAddFriend.slideToggle();
    })
    $searchUserButton.click(event => {
        event.preventDefault();
        $toggleAddFriendList.empty();
        const keyword = $('#searchUserInput').val();
        if(keyword.length === 0){return;}
        $.post("users/search", {
            keyword
        }, function (data) {
            for (let i = 0; i < data.length; i++) {
                const user = data[i];
                const $card = $(`        
                <div class="card">
                    <div class="row">
                    <div class="col-md-4">
                        <img class="img-fluid" alt="" src="${user.image?user.image:"/images/avatars/default_avatar.png"}" style="padding-top: auto 1px;">
                    </div>
                    <div class="col-md-8">
                        <h5 class="card-title">${user.username}</h5>
                        <span>${user.language}</span>
                    </div>
                    </div>
                    <div class="row">
                    <div class="card-body">
                        <span>${user.email}</span>
                    </div>
                    </div>
                    <div class="row">
                    <a href="#" newFriendId="${user._id}" class="btn btn-success btn-sm friend_add_request">${getUtilsMap("Add")}</a>
                    </div>
              </div>
              `)
                $card.find(".friend_add_request").click(addNewFriend);
                $toggleAddFriendList.append($card);
            }
        });
    })

    function addNewFriend(event) {
        const data = {
            userId,
            friendId: $(event.target).attr("newfriendid")
        }
        const $target = $(event.target)
        $.post("/users/addFriend", data, function (res) {
            if (res.status === 1) {
                let $error = $(`
                <div class="alert alert-warning" role="alert" style="width:80%; margin-left: 10%;
                margin-top: 5px;">${getUtilsMap(res.msg)}</div>
                `)
                $target.after($error)

                $target.text(`${getUtilsMap("Failed")}`)
                $target.removeClass("btn-success");
                $target.addClass("btn-danger");
            } else {
                $target.text(`${getUtilsMap("Pending")}`)
            }
            $target.addClass("disabled");
        })
    }
    //pending list
    $('#togglePendingListButton').click((event) => {
        event.preventDefault();
        $togglePendingList.empty();
        $.post("/users/getPendingList", {
            userId
        }, function (responseMessage) {
            if (responseMessage.status === 0) {
                if (responseMessage.data.length === 0) {
                    $togglePendingList.append(`<span>${getUtilsMap("No Pending Request.")}</span>`)
                } else {
                    const pendingList = responseMessage.data;
                    for (let i = 0; i < pendingList.length; i++) {
                        const pendingUser = pendingList[i];
                        const $card = $(`
                        <div class="card">
                            <div class="row">
                                <div class="col-md-4">
                                    <img class="img-fluid" alt="" src="${pendingUser.userImage?pendingUser.userImage:"/images/avatars/default_avatar.png"}" style="padding-top: auto 1px;">
                                </div>
                                <div class="col-md-8">
                                    <div class="card-body">
                                    <h5 class="card-title">${pendingUser.username}</h5>
                                    </div>
                                </div>
                            </div>
                            <div class="row" pendingFriendId="${pendingUser.userId}" pendingFriendName="${pendingUser.username}">
                                <a href="#" class="btn btn-success btn-sm friend_request_accept">${getUtilsMap("Accept")}</a>
                                <a href="#" class="btn btn-danger btn-sm friend_request_decline">${getUtilsMap("Reject")}</a>
                            </div>
                      </div>
                        `)
                        $card.find('.friend_request_accept').click(processPendingRequest);
                        $card.find('.friend_request_decline').click(processPendingRequest);
                        $togglePendingList.append($card);
                    }
                }
            }
        })
        $togglePendingList.slideToggle();
    })

    function processPendingRequest(e) {
        e.preventDefault();
        let accept = true;
        if ($(e.target).hasClass("friend_request_decline")) {
            accept = false;
        }
        let $target = $(e.target.parentNode);
        let data = {
            accept,
            userId,
            friendId: $target.attr("pendingFriendId"),
            username,
            friendname: $target.attr("pendingFriendName")

        }
        $.post("/users/friendRequestProcess", data, function (responseMessage) {
            if (responseMessage.code === 0) {
                window.location.reload()
                console.log(responseMessage)
            } else {
                //fail
            }
        });
        if (accept) {
            $target.children('.friend_request_accept').text(`${getUtilsMap("Accepted")}`);
        } else {
            $target.children('.friend_request_decline').text(`${getUtilsMap("Rejected")}`);
        }
        $target.children().addClass("disabled");

    }


    //toggle original data
    $('#chatLog').on("mouseenter", ".card", function () {
        // console.log($(this).find(".originalData"))
        $($(this).find(".originalData")).show();
    });
    $('#chatLog').on("mouseleave", ".card", function () {
        // console.log($(this).find(".originalData"))
        $($(this).find(".originalData")).hide();
    });
})