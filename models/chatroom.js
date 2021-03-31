const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatroomSchema = new Schema({
    title: String,
    image: String,
    // image: {
    //         url: String,
    //         filename: String
    // },
    description: String,
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    data: []
});

module.exports = mongoose.model('Chatroom', ChatroomSchema);