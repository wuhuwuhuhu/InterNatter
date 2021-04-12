// @vitalets/google-translate-api package required
// npm install translation-google   
// language list is in the same folder -- languages.js

/*
return format:
success: 
    {
        code: 1,
        text: transalted text
    }

fail: 
    {
        code: 0,
        msg: fail msg
    }
*/
const translator = require('@vitalets/google-translate-api');

const translate = async ({text, from, to}) => {
    if(!text || ! to) return {code: 1, msg: "Plese provide text needed to be translated and the target language."};
    from = decodeURI(from)
    to = decodeURI(to)
    let regEmoji = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g;
    let emojis = text.match(regEmoji);
    let emojiString = "";
    if(emojis && emojis.length != 0){
        for(let i = 0; i < emojis.length; i++){
            emojiString += emojis[i];
        }
        text = text.replace(regEmoji, "");
    }
    code = 0;
    data = "";
    msg = "";
    if(text.length === 0){
        return {code:0, text: emojiString};
    }
    if(from) {
        try {
            const res = await translator(text, {from,to});
            return {code:0, text: res.text + emojiString};
        } catch (error) {
            return {code:1, msg: error};
        }
    }
    else {
        try {
            const res = await translator(text, {to});
            return {code:0, text: res.text + emojiString};
        } catch (error) {
            return {code:1, msg: error};
        }
    }
    }
module.exports = {translate}