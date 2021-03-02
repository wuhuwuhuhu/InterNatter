# API of backend-frontend interaction 

## catalog
	1). log in
	2). register

## 1. log in

### Request URL：
	http://localhost:3000/login

### Request Method
	POST

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
          "language": "Chinese"
        }
      }
	fail:
	  {
        "status": 1,
        "msg": "incorrect username or password."
      }

## 2. register

### Request URL：
	http://localhost:3000/register

### Request Method
	POST

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

### Request URL：
	http://localhost:3000/resetPassword

### Request Method
	POST

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
          "language": "zh-CN"
        }
      }
	fail:
	  {
        "status": 1,
        "msg": "the username has been registered."
      }
