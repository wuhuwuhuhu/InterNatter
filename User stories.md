# User stories

+ All pages
  - choose app's language from hundreds of languages
  - flash success message when success 
  - flash error message when error
  - nav bar
  - show Error 404 if an unexist page is visited

+ Signup
  - check if repeat
  - save hashed password (add salt to the password) (use Bcrypt.js)
  - set nickname/ default language(send/listen) / other profile info(can be skiped)
  - If user skiped default language, then set to English
  - User login automatically after signup

+ Login
  - store the url user is requesting, and redirect to it after loged in
  - User login expires in a week

+ Logout


+ In chatroom
  - choose to turn on/off auto translation
  - show users list
  - choose to show history messages
  - show current language the user uses when typing
  - tell listeners the original language of sentences
  - left click a sentence to translate/not translate it
  - hover on a user's name or img to show abbreviated profile
  - click on a user's name or img to enter to its profile
  - right click on a user's name or img to (report/ send friend request/ see profile/ @)
  - right click on a sentence to (report/ quote/ translate or not)
  - right click on the chatroom's name/img to (report/ add to favorite/ 

+ New chatroom
  - User can open new chatrooms
  - User can open up to 3 new chatrooms in a week
  - User's authorization
  - Host can set up a robot

+ Edit chatroom

+ Dismiss chatroom

+ Robot system
  - If people in a chatroom <= 5 && 8 sec no response, robot will respond
  - Host can change Robot's first language

+ User's authorization
  - Host can dismiss a chatroom
  - Users can invite friends

+ Report system

+ Remind system
  - How to remind users when new messages come?