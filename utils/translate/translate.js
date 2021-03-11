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
    code = 0;
    data = "";
    msg = "";
    if(from) {
        try {
            const res = await translator(text, {from,to});
            return {code:0, text: res.text};
        } catch (error) {
            return {code:1, msg: error};
        }
    }
    else {
        try {
            const res = await translator(text, {to});
            return {code:0, text: res.text};
        } catch (error) {
            return {code:1, msg: error};
        }
    }
    }
module.exports = {translate}