const fs = require('fs');
const async = require('async');
const events = require('events');
const helpers = require('../helpers/helpers');
const express = require('express');
const path = require('path');
const util = require('util');
const walk = require('walk');
const router = express.Router();

const LOG_DIR = '/var/log/clientlog';
const DEFAULT_START_TIME_HR = 8;

exports.levels = {
    ERROR: 0,
    WARN: 1,
    INFO: 2,
    VERBOSE: 3,
    DEBUG: 4
};

exports.getClass = (level) => {
    let levelStr;
    if(helpers.isUndefined(level)){
        levelStr = 'debug';
    }
    else{
        levelStr = level;
    }
    return util.format('logline-%s', levelStr.toLowerCase());
};

exports.generateLogEntries = (logPath) => {
    return new Promise((resolve, reject) => {
        async.waterfall([
                (next) => {
                    fs.readFile(path.join(LOG_DIR, logPath), (err, data) => {
                        next(null, data.toString());
                    });
                },
                (data, next) => {
                    next(null, data.split('\n'));
                },
                (data, done) => {
                    let logEntries = [];
                    for(let logEntry of data){
                        let parts = logEntry.split(/[+ ]+/);
                        let isoTime, timestamp, levelKey, level;
                        try{
                            isoTime = parts[0].substring(1, parts[0].length - 1);
                            timestamp = new Date(isoTime).getTime();
                            levelKey = parts[1].substring(1, parts[1].length - 2);
                            level = helpers.isUndefined(levelKey) ? undefined : exports.levels[levelKey];
                        }
                        catch(err){

                        }
                        logEntries.push({
                            text: logEntry,
                            time: timestamp,
                            level: level,
                            classStr: exports.getClass(levelKey)
                        });
                    }
                    done(null, logEntries)
                }],
                (err, results) => {
                    resolve(results);
                }
        );
    });
};

exports.getLogFileNames = (logDir) => {
    return new Promise((resolve, reject) => {
        let logFileNames = [];
        let walker = walk.walk(logDir);
        walker.on('file', (root, fileStats, next) => {
            logFileNames.push(fileStats.name);
            next();
        });

        walker.on('end', () => {
            resolve(logFileNames);
        });
    });

};

exports.LogFile = function(logPath){
    const self = this;
    exports.generateLogEntries(logPath).then((data) => {
        self.logEntries = data;
        self.emit('ready');
    });
};

exports.LogFile.prototype.__proto__ = events.EventEmitter.prototype;

exports.LogFile.prototype.query = function(query){
    const self = this;
    return new Promise((resolve, reject) => {
        let startTimestamp = helpers.isUndefined(query.startdt) ? new Date().getTime() - 60 * 60 * 1000 * DEFAULT_START_TIME_HR
            : new Date(query.startdt).getTime();
        let endTimestamp = helpers.isUndefined(query.enddt) ? new Date().getTime() : new Date(query.enddt).getTime();
        let startLine = query.startline || 0;
        let endLine = query.endline || self.logEntries.length;
        let level = parseInt(query.level) || exports.levels.DEBUG;
        let filtered = self.logEntries.filter((entry) => {
            let timeMatch = entry.time >= startTimestamp && entry.time <= endTimestamp;
            let levelMatch = entry.level <= level;
            let lineMatch = self.logEntries.indexOf(entry) >= startLine && self.logEntries.indexOf(entry) <= endLine;
            return timeMatch && levelMatch && lineMatch;
        });
        resolve(filtered);
    });
};

exports.LogFile.prototype.getAll = function(){
    return this.logEntries;
};

router.get('/:logfile', (req, res, next) => {
    let logFile = new exports.LogFile(req.params.logfile);
    logFile.on('ready', () => {
        let promises = [
            logFile.query(req.query),
            exports.getLogFileNames(LOG_DIR)
        ];
        Promise.all(promises).then((values) => {
           res.render('logs', {
               title: req.params.logfile,
               logEntries: values[0],
               logFiles: values[1]
           });
        });

    });
});

module.exports = router;

exports.getLogFileNames(LOG_DIR);



