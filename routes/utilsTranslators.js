const Utils = require('../models/utils');

async function utilsTranslator (req, res, names, selectedlanguage, originalLanguage) {
    let language = 'English';
    if(req.user && req.user.language){
        language = req.user.language;
    }
    if(selectedlanguage) language = selectedlanguage;
    if(!originalLanguage) originalLanguage = "English";
    let a = await Utils.getUtil(names, language, originalLanguage);
    return a;
}

async function navUtilsTranslator(req, res, selectedlanguage) {
    let names = ["Home Page","Chatrooms", "Login", "Register", "Friends", "Profile", "Logout"];
    return utilsTranslator(req, res, names, selectedlanguage);
}

module.exports = {utilsTranslator, navUtilsTranslator};