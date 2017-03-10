'use strict';

const Tail = require('tail').Tail;
const events = require('events');
const express = require('express');
const path = require('path');
const clone = require('clone');
const router = express.Router();
const io = require('socket.io')(3001);

const helpers = require('../helpers/helpers');
const folderParser = require('../helpers/folderparser');
const lineParser = require('../helpers/lineparser');
const constants = require('../helpers/constants');

class LiveLog extends events.EventEmitter{
    constructor(logPath){
        super();
        const self = this;
        this.tail = new Tail(logPath);
        this.tail.on('line', (data) => {
            self.emit('line', data);
        });
    }
}

let liveLog;

io.on('connection', (socket) => {
    let i = 0;
    if(!helpers.isUndefined(liveLog)){
        liveLog.on('line', (data) => {
            socket.emit('line', lineParser.parseLine(data, ++i));
        });
    }
});



router.get('/view/:logfile', (req, res, next) => {
    folderParser.getLogFileNames(constants.logDir).then((logFiles) => {
        liveLog = new LiveLog(path.join(constants.logDir, req.params.logfile));
        res.render('live', {
            title: req.params.logfile,
            logFiles: logFiles,
            sysName: constants.sysName,
            logDirec: constants.logDir
        });
    });
});

router.get('/view', (req, res, next) => {
    folderParser.getLogFileNames(constants.logDir).then((logFiles) => {
        res.redirect(`/live/view/${logFiles[0]}`)
    });
});


module.exports = router;
