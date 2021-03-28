const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const User = require('../models/user')
const translator = require('../utils/translate/translate').translate;


const FriendsSchema = new Schema({
	userId: {type: mongoose.ObjectId,required: true},
    username: String,
    friendId: {type: mongoose.ObjectId, required: true},
    friendname: String,
    
    
});

module.exports = mongoose.model('friend', FriendsSchema);


