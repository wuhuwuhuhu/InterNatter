# API of backend-frontend interaction 

## catalog
	1). log in
	2). register
  3). reset password
  4). get chat log
  5). send message to chatroom

## 1. log in

### Request Method：
	models/user.checkPassword(username, password)

### description
  * after login, save username, userId, language in cookie

### Parameters
	|Parameter   |Required?  |Type     |Description
	|username    |Y          |string   |user name
	|password    |Y          |string   |user password

### return examples：
	success:
      {
        "status": 0,
        "data": {
          "_id": "5c3b297dssd883f340178b0",
          "username": "admin",
          "language": "zh-CN"
        }
      }
	fail:
	  {
        "status": 1,
        "msg": "incorrect username or password."
      }

## 2. register

### Request Method：
	models/user.register(username, email, password, language)

### description
  * parameter language will be selected from model/translate/language.js
  * after successfully register and authen, save username, userId, language in cookie
  
### Parameters
	|Parameter   |Required?  |Type     |Description
	|username    |Y          |string   |user name
	|email       |Y          |string   |user email
  |password    |Y          |string   |user password
  |language    |Y          |string   |user prefered language

### return examples：
	success:
	  {
        "status": 0,
        "data": {
          "_id": "5c3b297dssd883f340178b0",
          "username": "admin",
          "language": "en"
        }
      }
	fail:
	  {
        "status": 1,
        "msg": "the username has been registered."
      }

## 3. reset password

### Request Method：
	models/user.resetPassword(username)

### Description
  * reset password to 'abcd1234'
  * if possible, send new password to email

### Parameters
	|Parameter   |Required?  |Type     |Description
	|username    |Y          |string   |user name

### return examples：
	success:
	  {
        "status": 0,
        "data": {
          "_id": "5c3b297dssd883f340178b0",
          "username": "admin",
          "language": "zh-CN"
        }
      }
	fail:
	  {
        "status": 1,
        "msg": "the username has been registered."
      }

## 4. get chat log

### Request Method：
	models.chatroom.getChatLog(chatroomId, language)

### Description
  * return all translated chat log of one special chatroom
  * parameter language will be selected from model/translate/language.js

### Parameters
	|Parameter   |Required?  |Type     |Description
	|chatroomId  |Y          |string   |chatroom Id
	|language    |Y          |string   |chat log language required

### return examples：
	success:
	  {
        "status": 0,
        "data": {
          {
            "sender": "whd",
            "content": "Hello.",
            "send_time": 1614907034604,
          },
          {
            "sender": "zhao",
            "content": "Nice to meet you.",
            "send_time": 1614907034620
          }
        }
      }
	fail:
	  {
        "status": 1,
        "msg": "something wrong."
      }

## 5. save message
	models.chatroom.SaveMsg(chatroomId, userId, content)

### Description
  * save message sent from user
  * also save originLanuage according to the user's information
  * also save send_time according to the server time 


### Parameters
	|Parameter   |Required?  |Type     |Description
  |userId      |Y          |string   |user Id
	|chatroomId  |Y          |string   |chatroom Id
  |content     |Y          |string   |chat content
  
### return examples：
	success:
	  {
        "status": 0,
        "data": {
          {
            "sender": "whd",
            "content": "Hello.",
            "send_time": 1614907034604,
            "originLanuage": 'en'
          }
        }
      }
	fail:
	  {
        "status": 1,
        "msg": "something wrong."
      }