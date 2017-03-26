![slask](/images/slask.png)
---
[![Build Status](https://travis-ci.org/nvandoorn/slask.svg?branch=master)](https://travis-ci.org/nvandoorn/slask)

A simple web based client to view and filter logs. This project was originally implemented using server side view rendering and hacked together XHR requests to update the front-end in real time. Currently transitioning to a React based front-end with a RESTful API.

## TODO
- Implement a simple config API
- Finish basic react integration
- Eject react-scripts so to add CSS modules
- Spend some time making it look pretty (Sketch and maybe Invision mockups)
- Rethink routing (Redux/React router)
- Write front-end tests and increase server test coverage
- Include more API call examples in server

## Running This Project
- Running the dev environment: `npm start`
- Running the backend with a prebuilt front-end: `npm build` (to be implemented)
- Running server tests: `npm test`
- Running the client test: `npm run test-client` (to be implemented)

## Client Side
Implemented using React and Webpack. Screenshots and details coming soon.

### Sketch Mockups (work in progress)

#### Phone Viewport
![Phone](/mockup/phone.png?raw=true&dt=18  "Phone")

#### Tablet Viewport
![Tablet](/mockup/tablet.png?raw=true&dt=18  "Tablet")

#### Desktop Viewport
![Desktop](/mockup/desktop.png?raw=true&dt=18 "Desktop")

### Prototype Demo
This prototype is implemented using Express/Jade view rendering and hacked together front end code (but it looks kinda pretty).

#### File Demo [Watch here](https://www.youtube.com/watch?v=JDvBDKce0lI)
![File Demo](/images/file.png?raw=true "File Demo")


#### Live Demo [Watch here](https://www.youtube.com/watch?v=iQANjRNFcqE)
![Live Demo](/images/live.png?raw=true "Live Demo")

## Server Side

### Routes

#### `PUT` /api/config

##### Example requests body
```javascript
{
	"datetimePattern": "/\\[(\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z)\\]/",
	"levelPattern": "/\\[([\\w\\s]+|\\w+)\\]:\\s/",
	"timeFormatter": "h:MM:ss",
	"folders": [
		{
			"name": "Test Fixture",
			"directory": "/Users/nick/Documents/slask/src/server/test/fixtures"
		}
	]
}
```

##### Example Response
```javascript
{
	"success": true,
	"msg": "Config set: true",
	"data": {
		"datetimePattern": "/\\[(\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z)\\]/",
		"levelPattern": "/\\[([\\w\\s]+|\\w+)\\]:\\s/",
		"timeFormatter": "h:MM:ss",
		"folders": [
			{
				"name": "Test Fixture",
				"directory": "/Users/nick/Documents/slask/src/server/test/fixtures"
			}
		]
	}
}
```

#### `GET` /api/config

##### Example Response
```javascript
{
	"success": true,
	"msg": "Config read",
	"data": {
		"datetimePattern": "/\\[(\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z)\\]/",
		"levelPattern": "/\\[([\\w\\s]+|\\w+)\\]:\\s/",
		"timeFormatter": "h:MM:ss",
		"folders": [
			{
				"name": "Test Fixture",
				"directory": "/Users/nick/Documents/slask/src/server/test/fixtures"
			}
		]
	}
}
```
#### `GET` /api/file

##### Example Request

`GET` `http://localhost:4000/api/file?logfile=testlog.log&startdt=1489387840000&enddt=1490333975974&level=4&pagesize=20&pagenum=1`

|  Param   |       Type        |                   Description                    |
| -------- | ----------------- | ------------------------------------------------ |
| logfile  | path (string)     | Path to logfile relative to folder set in config |
| pagenum  | integer           | Current page number                             |
| pagesize | integer           | Number of log entries per page                   |
| startdt  | datetime string   | Starting datetime                                |
| enddt    | datetime string   | Ending datetime                                  |
| level    | One of Level Enum | Log severity level defined below                 |

###### Level Enum

|  Level  | Value |
| ------- | ----- |
| Error   | 0     |
| Warning | 1     |
| Info    | 2     |
| Verbose | 3     |
| Debug   | 4     |

##### Example Response
```javascript
{
	"success": true,
	"msg": "Queried logfile",
	"data": {
		"logentries": [
			{
				"text": "You must be pretty desperate if you're looking at the logs",
				"level": 2,
				"levelStr": "info",
				"datetime": 1489387840000,
				"datetimeStr": "11:50:40"
			},
			{
				"text": "Hello world",
				"level": 0,
				"levelStr": "error",
				"datetime": 1489387841000,
				"datetimeStr": "11:50:41"
			},
			{
				"text": "Lovely weather we're having",
				"level": 1,
				"levelStr": "warn",
				"datetime": 1489387841000,
				"datetimeStr": "11:50:41"
			},
			{
				"text": "That's all for now folks",
				"level": 4,
				"levelStr": "debug",
				"datetime": 1489387841000,
				"datetimeStr": "11:50:41"
			},
			{
				"text": "You must be pretty desperate if you're looking at the logs",
				"level": 4,
				"levelStr": "debug",
				"datetime": 1489387840000,
				"datetimeStr": "11:50:40"
			}
		]
	}
}
```

#### `GET` /api/directory

Gets the directory listing for the first folder configured in `config.folders`

##### Example Response
```javascript
{
	"logFiles": [
		"debug_debug_livelog.log",
		"debug_debug_livelog1.log",
		"debug_debug_livelog2.log",
		"debug_debug_livelog3.log",
		"debug_livelog.log",
		"debug_livelog1.log",
		"debug_livelog2.log"
	]
}
```
