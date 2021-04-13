const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const translator = require('../utils/translate/translate').translate;

let UtilSchema = new Schema({
	name: {type: String},
    versions:{type: Map, of: String}
});

UtilSchema.statics.getUtil = async function (names, language, originalLanguage){
    //parameter is an array of names needed to be translated.
    let namesTranslated = {};
    for(let i = 0; i < names.length; i++){
        const name = names[i];
        let nameObj = await mongoose.model('Util').findOne({'name': name});
        if(!nameObj){
            versions = {
                [originalLanguage]: name
            }
            nameObj = await mongoose.model('Util').create({name, versions});
        }
        let translatedName = nameObj.versions.get(language);
        if(!translatedName){
            let response;
            if(originalLanguage === "auto"){
                response = await translator({text: name, to: language});
            }else{
                response = await translator({text: name, from: originalLanguage, to: language});
            }
            translatedName = response.text;
            nameObj.versions.set(language, translatedName)
            nameObj.save();
        }
        namesTranslated[name] = nameObj.versions.get(language);
    }
    return namesTranslated;
}



var UtilModule = mongoose.model('Util', UtilSchema);


module.exports = UtilModule