![slask](/images/slask.png)
---
[![Build Status](https://travis-ci.org/nvandoorn/slask.svg?branch=master)](https://travis-ci.org/nvandoorn/slask) [![Standard - JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)


A simple web based client to view and filter logs. This project was originally implemented using server side view rendering and hacked together XHR requests to update the front-end in real time. Currently transitioning to a React based front-end with a RESTful API.

## TODO
- Implement config interface
- Implement logfile directory interface
- Integrate front-end with API
- Rethink route handling on the front-end (React router)
- Improve front-end request handling (possible Redux longterm)
- Write front-end tests and increase server test coverage
- Include more API call examples in readme
- Server side config validation (probably JSON schema)

## Running This Project
- Running the dev environment: `npm run dev`
- Running the backend with an optimized front-end build: `npm start`
- Building the front-end: `npm run build`
- Running tests (and standard linter): `npm test`
- Running the standard linter (included in `npm test`): `npm run lint`

**Note**: Running or building the client lints with babel-eslint

## Client Side
Implemented using React and Webpack. This implementation still has a long way to go, but attached is a screenshot of the front-end to date.

![slask front-end](/images/front-end.png "slask front-end")

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
	"datetimePattern": "\\[(\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z)\\]",
	"levelPattern": "\\[([\\w\\s]+|\\w+)\\]:\\s",
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
		"datetimePattern": "\\[(\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z)\\]",
		"levelPattern": "\\[([\\w\\s]+|\\w+)\\]:\\s",
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
		"datetimePattern": "\\[(\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z)\\]",
		"levelPattern": "\\[([\\w\\s]+|\\w+)\\]:\\s",
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
	"msg": "Queried /Users/nick/Documents/slask/src/server/test/fixtures/testlog.log",
	"data": [
		{
			"text": "You must be pretty desperate if you're looking at the logs",
			"level": 2,
			"levelStr": "info",
			"datetime": 1489387840000,
			"datetimeStr": "6:50:40"
		},
		{
			"text": "Hello world",
			"level": 0,
			"levelStr": "error",
			"datetime": 1489387841000,
			"datetimeStr": "6:50:41"
		},
		{
			"text": "Lovely weather we're having",
			"level": 1,
			"levelStr": "warn",
			"datetime": 1489387841000,
			"datetimeStr": "6:50:41"
		},
		{
			"text": "That's all for now folks",
			"level": 4,
			"levelStr": "debug",
			"datetime": 1489387841000,
			"datetimeStr": "6:50:41"
		},
		{
			"text": "You must be pretty desperate if you're looking at the logs",
			"level": 4,
			"levelStr": "debug",
			"datetime": 1489387840000,
			"datetimeStr": "6:50:40"
		}
	]
}
```

#### `GET` /api/directory

Gets the directory listing for the first folder configured in `config.folders`

##### Example Response
```javascript
{
	"success": true,
	"msg": "Successfully listed /Users/nick/Documents/slask/src/server/test/fixtures",
	"data": [
		"testlog.log"
	]
}
```
