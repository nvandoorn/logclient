![slask](/images/slask.png)
---
[![Build Status](https://travis-ci.org/nvandoorn/slask.svg?branch=master)](https://travis-ci.org/nvandoorn/slask) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)


[Live Demo](http://slaskdemo.herokuapp.com/)

![slask demo](/images/slask-demo.gif "slask demo")

Install slask on whatever machine contains your log files. slask is designed with remote systems debugging in mind. Developing some automation equipment using a Linux based single board computer? Install slask on your single board computer to effortlessly view logs without having to use SFTP or SSH.

## Active Work Show and Tell
### [#5](https://github.com/nvandoorn/slask/issues/5) Implement datetime pickers
![Datepicker](/images/datepicker.gif "Datepicker")

Datetime picker as of commit [d2edd05](https://github.com/nvandoorn/slask/commit/d8505e81b28205d865adaba255e7fcae2277a957)

## Running This Project
- Running the dev environment: `npm run dev`
- Running the dev environment in debug mode: `npm run dev-debug`
- Running the backend with an optimized front-end build : `npm start`
- Building the front-end: `npm run build`
- Running tests (and standard linter): `npm test`
- Running the standard linter (included in `npm test`): `npm run lint`

**Note**: Running or building the client lints with babel-eslint

## Client Side
Implemented in React and bundled with Webpack.

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

#### `POST` /api/config

Modifies the config. Only the supplied keys are applied, other keys are left as is.

##### Example requests body
```javascript
{
	"datetimePattern": "\\[(\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z)\\]",
	"levelPattern": "\\[([\\w\\s]+|\\w+)\\]:\\s",
	"timeFormatter": "h:MM:ss"
}
```

##### Example Response
```javascript
{
	"success": true,
	"msg": "Config set: true",
	"data": [
		"datetimePattern": "\\[(\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z)\\]",
		"levelPattern": "\\[([\\w\\s]+|\\w+)\\]:\\s",
		"timeFormatter": "h:MM:ss",
		"inputTimezone": 0,
		"outputTimezone": 8,
		"directories": [
			{
				"path": "/var/log/somelogs",
				"name": "Some Wonderful Logs",
				"key": 0,
				"active": false
			},
			{
				"path": "/var/log/someotherlogs",
				"name": "Some Other Wonderful Logs",
				"key": 1,
				"active": true
			}
		]
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
		"inputTimezone": 0,
		"outputTimezone": 8,
		"directories": [
			{
				"path": "/var/log/somelogs",
				"name": "Some Wonderful Logs",
				"key": 0,
				"active": false
			},
			{
				"path": "/var/log/someotherlogs",
				"name": "Some Other Wonderful Logs",
				"key": 1,
				"active": true
			}
		]
	}
}
```
#### `GET` /api/file

##### Example Request

`GET` `http://localhost:4000/api/file?key=0&startdt=1489387840000&enddt=1490333975974&level=4&pagesize=20&pagenum=1`

|  Param   |       Type        |                          Description                           |
| -------- | ----------------- | -------------------------------------------------------------- |
| key      | integer           | Key for a given logfile retreieved from `GET` `/api/directory` |
| pagenum  | integer           | Current page number                                            |
| pagesize | integer           | Number of log entries per page                                 |
| startdt  | datetime string   | Starting datetime                                              |
| enddt    | datetime string   | Ending datetime                                                |
| level    | One of Level Enum | Log severity level defined below                               |

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

#### `GET` /api/directories

Lists directories added by `PUT` `/api/directories`

##### Example Response
```javascript
{
	"success": true,
	"msg": "Successfully listed directories",
	"data": [
		{
			"path": "/var/log/somelogs",
			"name": "Some Wonderful Logs",
			"key": 0,
			"active": false
		},
		{
			"path": "/var/log/someotherlogs",
			"name": "Some Other Wonderful Logs",
			"key": 1,
			"active": true
		}
	]
}
```

#### `PUT` /api/directories

Adds a new directory to the list retrieved from `GET` `/api/directories`

##### Example Request
```javascript
{
	"path": "/var/log/somelogs",
	"name": "Some Wonderful Logs"
}
```

##### Example Response
```javascript
{
	"success": true,
	"msg": "Successfully listed directories",
	"data": [
		{
			"path": "/var/log/somelogs",
			"name": "Some Wonderful Logs",
			"key": 0,
			"active": false
		},
		{
			"path": "/var/log/someotherlogs",
			"name": "Some Other Wonderful Logs",
			"key": 1,
			"active": true
		}
	]
}
```

#### `POST` /api/directories

Modify directory to the list retrieved from `GET` `/api/directories`

##### Example Request
```javascript
{
	"path": "/var/log/somelogs",
	"name": "Some Wonderful New Name Logs",
	"key": 0
}
```

##### Example Response
```javascript
{
	"success": true,
	"msg": "Successfully modified directory",
	"data": [
		{
			"path": "/var/log/somelogs",
			"name": "Some Wonderful Logs",
			"key": 0,
			"active": false
		},
		{
			"path": "/var/log/someotherlogs",
			"name": "Some Other Wonderful Logs",
			"key": 1,
			"active": true
		}
	]
}
```

#### `GET` /api/directory

Gets the directory listing for the directory set in `POST` `/api/directory`

##### Example Response
```javascript
{
	"success": true,
	"msg": "Successfully retrieved directory listing",
	"data": [
		{
			"name": "log0.log",
			"key": 0
		},
		{
			"name": "log1.log",
			"key": 1
		}
	]
}
```

#### `POST` /api/directory

Sets the active directory to be used for `GET` `/api/file`. Please note this directory will be parsed ahead of time so requests on `GET` `/api/file` are very quick.

##### Example Request
```javascript
{
	"key": 0
}
```

##### Example Response
```javascript
{
	"success": true,
	"msg": "Successfully set active directory",
	"data": {
			"key": 0
		}
	}
}
```
