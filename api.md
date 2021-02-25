# API of backend-frontend interaction 

## catalog
	1). log in
	2). register

## 1. log in

### Request URL：
	http://localhost:3000/login

### Request URL
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

### Request URL
	POST

### Parameters
	|Parameter   |Required?  |Type     |Description
	|username    |Y          |string   |user name
	|email       |Y          |string   |user email
    |password    |Y          |string   |user password

### return examples：
	success:
	  {
        "status": 0,
        "data": {
          "_id": "5c3b297dssd883f340178b0",
          "username": "admin",
        }
      }
	fail:
	  {
        "status": 1,
        "msg": "the username has been registered."
      }
