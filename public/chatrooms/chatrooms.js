// const sendMsg = require("/chatrooms.socketio_test.js")
// import {sendMsg} from './socketio_test'
$(() => {
    // const {username, userLanguage} = require('../../utils/readCookie')
    const translate = require('../../utils/translate/translate').translate;
    const test = async () => {
        const a = await translate({
            text: "hello",
            from: "en",
            to: "es"
        });
        console.log("a", a.text)
    }

    async function main() {
        let a = await translate({
            text: "hello",
            from: "en",
            to: "zh-CN"
        })
        console.log("Translate hello to chinese " + a.text)
    }
    test()
    main()

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
        let kk = await translate({
            text: "hello",
            from: "en",
            to: "zh-CN"
        })

        console.log(kk);
        console.log("kk", kk.text);

        async function main() {
            let a = await translate({
                text: "hello",
                from: "en",
                to: "zh-CN"
            })
            
            console.log("Translate hello to chinese " + a.text)
        
            let b = await translate({
                text: "今天是周日",
                to: "en"
            })
        
            console.log("Translated '今天是周日' to English(with automatic language detection) " + b.text)
            
            let c = await translate({
                text: "Hi, Nice to meet",
                from: "en",
                to: "es"
            })
            
            console.log("Translated 'Hi, Nice to meet' you to Spanish " + c.text)
        }
        await main()
        const translation = async () => {
            const a = await translate({
                text: chat.originalMsg,
                from: "en",
                to: "es"
            });
            console.log("translation", a.text)
        };
        translation();

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