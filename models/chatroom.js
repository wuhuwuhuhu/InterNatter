const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatroomSchema = new Schema({
    title: String,
    image: String,
    description: String,
    data: []
});

module.exports = mongoose.model('Chatroom', ChatroomSchema);