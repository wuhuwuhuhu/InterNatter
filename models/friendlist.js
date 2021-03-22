const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const User = require('../models/user')
const translator = require('../utils/translate/translate').translate;


const FriendSchema = new Schema({
	userId: {type: mongoose.ObjectId,required: true},
    username: String,
    friendId: {type: mongoose.ObjectId, required: true},
    friendname: String,
    
    
});

module.exports = mongoose.model('friendList', FriendSchema);


/*

mongoose.connect('mongodb://localhost:27017/InterNatter', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})



const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});




let FriendSchema = new Schema({
	sender: mongoose.ObjectId,
    friend: String
    
});

const exist = async function(){
    const user = await User

    user.findById("60512aa535e33723948c198b", function(err, result) {
        if (err) {
          console.log("Error: user doesnt exist");
        } else {
            const friendList = new mongoose.model('friendlist', FriendSchema)
            var friend = new friendList({sender:'60512aa535e33723948c198b', friend: "aa" })

            friend.save(function (err, friend) {
                if (err) return console.error(err);
                console.log(" saved to bookstore collection.");
            });      
        }
      });
}

exist()






    const friendList = new mongoose.model('friendlist', FriendSchema)
//    const exist = await Chatroom.findById('60512aa535e33723948c198c')

    var friend = new friendList({sender:'60512aa535e33723948c198b', friend: "aa" })

    friend.save(function (err, book) {
        if (err) return console.error(err);
        console.log(" saved to bookstore collection.");
      });

  */  
    
    











