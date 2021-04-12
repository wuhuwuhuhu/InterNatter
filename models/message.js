const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const translator = require('../utils/translate/translate').translate;

let MessageSchema = new Schema({
	sender: mongoose.ObjectId,
    receiver: {type: mongoose.ObjectId,required: true},
    content: {type: String,required: true},
    senderName:{type: String},
    originalLanguage: {type: String, default: "English"},
    sendTime: {type: Date, default: new Date()},
    deleted:{type: Boolean, default: false},
    versions:{type: Map, of: String},
    portrait: {type: String}
});

MessageSchema.statics.createNew = async function (data){
    data.versions = {};
    data.versions[data.originalLanguage] = data.content;
    data.sendTime = new Date();
    return await mongoose.model('Message').create(data)
}
MessageSchema.statics.getMessage = async function (msgId, senderName, language){
    if(!language){
        language = "English"
    }
    let msg = await mongoose.model('Message').findById(msgId);
    let translatedMsg = msg.versions.get(language);
    if(!translatedMsg){
        let response = await translator({text: msg.content, from: msg.originalLanguage, to: language})
        translatedMsg = response.text;
        msg.versions.set(language, translatedMsg)
        msg.save()
    }
    if(!senderName && msg.sender){
        let senderUser = await mongoose.model('User').findById(msg.sender);
        senderName = senderUser.username
    }
    return {
        senderName: senderName,
        originalLanguage: msg.originalLanguage,
        originalMsg: msg.content,
        translatedMsg: translatedMsg,
        sendTime: msg.sendTime,
        portrait: msg.portrait
    }
}
MessageSchema.statics.getChatroomLog = async function (chatroomId, language){
    if(!language){
        language = "English"
    }
    let chatLog = await mongoose.model('Message').find({receiver: chatroomId})
    let r = []
    for(let i = 0; i < chatLog.length; i++){
        let chat = chatLog[i];
        let translatedMsg = chat.versions.get(language)
        if(!translatedMsg){
            let response = await translator({text: chat.content, from: chat.originalLanguage, to: language})
            translatedMsg = response.text;
            chat.versions.set(language, translatedMsg)
            chat.save()
        }
        let senderName = chat.senderName;
        if(!senderName && chat.sender){
            let senderUser = await mongoose.model('User').findById(msg.sender);
            senderName = senderUser.username
        }
        let portrait = chat.portrait;
        if(!portrait && chat.sender){
            let senderUser = await mongoose.model('User').findById(chat.sender);
            portrait = senderUser.image
        }
         
        r.push({
            senderName: senderName,
            originalLanguage: chat.originalLanguage,
            originalMsg: chat.content,
            translatedMsg: translatedMsg,
            sendTime: chat.sendTime,
            portrait
        })
    }
    return r
    
}

MessageSchema.statics.getPrivateChatLog = async function ({userId, friendId}){
    const user = await mongoose.model('User').findById(userId);
    const friend = await mongoose.model('User').findById(friendId);
    const chatLog = await mongoose.model('Message').find(
        {$or:[{receiver: userId, sender: friendId},{receiver: friendId, sender:userId}]}
        );
    let language = user.language;
    if(!language){
        language = "English"
    }
    let r = []
    for(let i = 0; i < chatLog.length; i++){
        let chat = chatLog[i];
        let translatedMsg = chat.versions.get(language)
        if(!translatedMsg){
            let response = await translator({text: chat.content, from: chat.originalLanguage, to: language})
            translatedMsg = response.text;
            chat.versions.set(language, translatedMsg)
            chat.save()
        }
        let senderName = chat.senderName;
        if(!senderName && chat.sender){
            let senderUser = await mongoose.model('User').findById(chat.sender);
            senderName = senderUser.username
        }

        let portrait = chat.portrait;
        if(!portrait && chat.sender){
            // console.log(chat.sender)
            let senderUser = await mongoose.model('User').findById(chat.sender);
            portrait = senderUser.image
        }
         
        r.push({
            senderName: senderName,
            originalLanguage: chat.originalLanguage,
            originalMsg: chat.content,
            translatedMsg: translatedMsg,
            sendTime: chat.sendTime,
            portrait
        })
    }
    return r
    
}

var MessageModule = mongoose.model('Message', MessageSchema);


module.exports = MessageModule