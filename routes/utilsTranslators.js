const Utils = require('../models/utils');

async function utilsTranslator (req, res, names, Selectedlanguage) {
    let language = 'English';
    if(req.user && req.user.language){
        language = req.user.language;
    }
    if(Selectedlanguage) language = Selectedlanguage;
    let a = await Utils.getUtil(names, language);
    return a;
}

async function navUtilsTranslator(req, res, Selectedlanguage) {
    let names = ["Home Page","Chatrooms", "Login", "Register", "Friends", "Profile", "Logout"];
    return utilsTranslator(req, res, names, Selectedlanguage);
}

module.exports = {utilsTranslator, navUtilsTranslator};