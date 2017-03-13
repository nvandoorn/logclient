# logclient
A simple web based client to view and filter logs. This project was originally implemented using server side view rendering and hacked together XHR requests to update the front-end in real time. Currently transitioning to a React based front-end with a RESTful API.

API desperately needs speed improvements (possibly even database caching TBD), but this project is focusing on front end development at the moment.

## TODO
1. Implement a simple config API
2. Finish basic react integration
3. Eject react-scripts so to add CSS modules
4. Spend some time making it look pretty
5. Write some tests (forgive me I have sinned)
6. Make the API less slow

## Client Side
Implemented using React and Webpack. Screenshots and details coming soon.

## Server Side
### Routes

#### `PUT` /api/config

##### Example requests body
```javascript
{
	"folders": [
		{
			"name": "mylogs",
			"directory": "/var/log/clientlog"
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
		"folders": [
			{
				"name": "mylogs",
				"directory": "/var/log/clientlog"
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
		"folders": [
			{
				"name": "mylogs",
				"directory": "/var/log/clientlog"
			}
		]
	}
}
```
#### `GET` /api/file

##### Example Request

|   Param   |       Type        |                   Description                    |
| --------- | ----------------- | ------------------------------------------------ |
| logfile   | path (string)     | Path to logfile relative to folder set in config |
| integer   | Page number       | Currenet page number                             |
| pagesize  | integer           | Number of log entries per page                   |
| startline | integer           | Staring log                                      |
| endline   | integer           | Ending line                                      |
| startdt   | ISO 8601 Datetime | Starting datetime                                |
| enddt     | ISO 8601 Datetime | Ending datetime                                  |
| level     | Level Enum        | Log severity level defined below                 |

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
	"title": "/var/log/clientlog/debug_debug_livelog.log",
	"logEntries": [
		{
			"text": "[2016-11-22T23:19:06Z] [DEBUG]: That's all for now folks\n",
			"time": 1489285446660,
			"level": 4,
			"classStr": "logline-debug",
			"line": 84319
		},
		{
			"text": "[2016-11-22T23:19:06Z] [INFO]: You must be pretty desperate if you're looking at the logs\n",
			"time": 1489285446660,
			"level": 2,
			"classStr": "logline-info",
			"line": 84320
		},
		...
	],
	"currentPage": 1,
	"nPages": 1688,
	"pageSize": 50,
	"nLines": 84368
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
