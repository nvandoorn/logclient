'use strict';

const fs = require('fs');
const async = require('async');
const events = require('events');
const helpers = require('../helpers/helpers');
const express = require('express');
const path = require('path');
const util = require('util');
const walk = require('walk');
const Heap = require('heap');
const clone = require('clone');
const router = express.Router();

const LOG_DIR = '/var/log/clientlog';
const DEFAULT_START_TIME_HR = 300;

/**
 *  Enum for log levels
 *
 * @type {{ERROR: number, WARN: number, INFO: number, VERBOSE: number, DEBUG: number}}
 */
exports.levels = {
    ERROR: 0,
    WARN: 1,
    INFO: 2,
    VERBOSE: 3,
    DEBUG: 4
};

exports.callType = {
    VIEW: 0,
    JSON: 1
};


/**
 * Models a given LogFile
 */
class LogFile extends events.EventEmitter{

    /**
     * Mapping to CSS classes from debug level
     *
     * @param level: string
     *  String from parsed log
     *  TODO
     *  should be an emum
     *
     * @returns: string
     *  CSS class string
     */
    static getClass(level){
        let keys = Object.keys(exports.levels);
        let levelInt = level;
        if(helpers.isUndefined(level)){
            levelInt = exports.levels.DEBUG;
        }
        return util.format('logline-%s', keys[levelInt].toLowerCase());
    }

    /**
     * Generates JSON object for a given log file
     *
     * @param logPath: string
     *  Path to log file
     * @returns: {Promise}
     *  Resolves with a list of JSON objects
     */
    static generateLogEntries(logPath){
        let index = 0;
        const self = this;
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
                        let logEntries = new Heap(LogFile.heapOrder);
                        for(let logEntry of data){
                            let parts = logEntry.split(/[+ ]+/);
                            let isoTime, timestamp, levelKey, level;
                            try{
                                isoTime = parts[0].substring(1, parts[0].length - 1);
                                timestamp = new Date(isoTime).getTime();
                                levelKey = parts[1].substring(1, parts[1].length - 2);
                                let validLevel = Object.keys(exports.levels).indexOf(levelKey) > 0;
                                if(validLevel){
                                    level = exports.levels[levelKey]
                                }
                            }
                            catch(err){

                            }
                            logEntries.push({
                                text: logEntry,
                                time: timestamp,
                                level: level,
                                classStr: LogFile.getClass(level),
                                line: ++index
                            });
                        }
                        done(null, logEntries)
                    }],
                (err, results) => {
                    resolve(results);
                }
            );
        });
    }

    /**
     * Walks a given directory for log files (used in sidebar)
     *
     * @param logDir: string
     *  Path to log direcory
     * @returns: {Promise}
     *  Resolves with a list of lognames
     */
    static getLogFileNames(logDir){
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

    }

    static heapOrder(a, b){
        return a.line - b.line;
    }

    /**
     * Constructor generates a list of logEntries
     * for a given log file
     *
     * @param logPath: string
     *  Path to log file
     */
    constructor(logPath) {
        super();
        const self = this;
        LogFile.generateLogEntries(logPath).then((data) => {
            self.logEntries = data;
            self.emit('ready');
        });
    }

    paginate(pageSize){
        let toPaginate = this.logEntries.clone();
        let pages = new Heap((a, b) => {
            let aLine = a.peek().line;
            let bLine = b.peek().line;
            return aLine - bLine;
        });

        while(!toPaginate.empty()){
            let page = new Heap(LogFile.heapOrder);
            while(page.size() <= pageSize && !toPaginate.empty()){
                page.push(toPaginate.pop());
            }
            pages.push(page);
        }
        return pages.toArray();
    }

    /**
     * Queries the list this list of fileEntries
     *
     * TODO
     * Defined this API better
     *
     * @param reqQuery: JSON object
     *  Query params (probably from express)
     * @returns {Promise}
     *  Resolves to a list of JSON objects
     */
    query(reqQuery) {
        const self = this;
        return new Promise((resolve, reject) => {
            let startTimestamp = helpers.isUndefined(reqQuery.startdt) ? new Date().getTime() - 60 * 60 * 1000 * DEFAULT_START_TIME_HR
                : new Date(reqQuery.startdt).getTime();
            let endTimestamp = helpers.isUndefined(reqQuery.enddt) ? new Date().getTime() : new Date(reqQuery.enddt).getTime();
            let startLine = parseInt(reqQuery.startline) || 0;
            let endLine = parseInt(reqQuery.endline) || self.logEntries.size();
            let level = parseInt(reqQuery.level) || exports.levels.DEBUG;
            let filtered = self.logEntries.toArray().filter((entry) => {
                let timeMatch = entry.time >= startTimestamp && entry.time <= endTimestamp;
                let levelMatch = entry.level <= level;
                let lineMatch = entry.line >= startLine && entry.line <= endLine;
                return timeMatch && levelMatch && lineMatch;
            });
            resolve(filtered);
        });
    }

    /**
     * Get all these logEntries
     *
     * @returns: list of JSON objects
     *  List of logEntry JSON objects
     */
    getAll() {
        return this.logEntries;
    }

}

/**
 * Only route so far
 */
router.get('/:logfile', (req, res, next) => {
    let logFile = new LogFile(req.params.logfile);
    logFile.on('ready', () => {
        let promises = [
            logFile.query(req.query),
            LogFile.getLogFileNames(LOG_DIR)
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

router.get('/:logfile/:pageNum', (req, res, next) => {
    let logFile = new LogFile(req.params.logfile);
    logFile.on('ready', () => {
        logFile.query(req.query).then((value) => {

        });
       res.json(logFile.paginate(10)[parseInt(req.params.pageNum)])
    });
});

module.exports = router;




