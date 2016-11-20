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
const SYS_NAME = 'System SN99';
const DEFAULT_PAGE_SIZE = 10;
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
        let isoDtExp = /(\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z\])/;
        let isoDtExpMatch = /\[(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z)\]/;
        const self = this;
        return new Promise((resolve, reject) => {
            async.waterfall([
                    (next) => {
                        fs.readFile(path.join(LOG_DIR, logPath), (err, data) => {
                            next(null, data.toString());
                        });
                    },
                    (data, next) => {
                        let split = data.split(isoDtExp);
                        let lines = [];
                        for(let i = 1; i < split.length; i += 2){
                            lines.push(split[i] + split[i+1]);
                        }
                        next(null, lines);
                    },
                    (data, done) => {
                        let logEntries = new Heap((a, b) => {
                            return a.line - b.line;
                        });
                        for(let logEntry of data){
                            let timeRegex = new RegExp(isoDtExpMatch);
                            let levelRegex = new RegExp(/\[(\w+)\]/);
                            let timeStr, levelStr, timestamp, level, classStr;
                            try{
                                timeStr = timeRegex.exec(logEntry)[1];
                                timestamp = new Date(timeStr).getTime();
                            }
                            catch(err){
                                LogFile.getTime(logEntries);
                            }

                            try{
                                levelStr = levelRegex.exec(logEntry)[1];
                                let keys = Object.keys(exports.levels);
                                level = keys.indexOf(levelStr);
                                if(level < 0){
                                    throw new Error('Invalid level');
                                }
                            }

                            catch(err){
                                level = LogFile.getLevel(logEntries);
                            }
                            classStr = LogFile.getClass(level);
                            logEntries.push({
                                text: logEntry,
                                time: timestamp,
                                level: level,
                                classStr: classStr,
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

    static getLevel(logEntries){
        let logEntriesCopy = logEntries.clone();
        while(!logEntriesCopy.empty()){
            let logEntry = logEntriesCopy.pop();
            if(!helpers.isUndefined(logEntry.level)){
                return logEntry.level;
            }
        }
        return exports.levels.DEBUG;
    }

    static getTime(logEntries){
        let logEntriesCopy = logEntries.clone();
        while(!logEntriesCopy.empty()){
            let logEntry = logEntriesCopy.pop();
            if(!helpers.isUndefined(logEntry.time)){
                return logEntry.time;
            }
        }
        return new Date().getTime();
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

    static paginate(toPaginate, pageSize){
        pageSize = parseInt(pageSize) || DEFAULT_PAGE_SIZE;
        let toPaginateHeap = LogFile.lineEntryHeapSort(toPaginate);
        let toReturn = [];
        while(!toPaginateHeap.empty()){
            let chunk = [];
            while(chunk.length < pageSize && !toPaginateHeap.empty()){
                chunk.push(toPaginateHeap.pop());
            }
            toReturn.push(chunk);
        }
        return toReturn;
    }

    static lineEntryHeapSort(lineEntries){
        let heap = new Heap((a, b) => {
            return a.line - b.line;
        });
        while(lineEntries.length > 0){
            heap.push(lineEntries.pop());
        }
        heap.heapify();
        return heap;
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
            let level;
            try{
                level = parseInt(reqQuery.level);
                if(isNaN(level)){
                    throw new Exception('level must be int')
                }
            }
            catch(err){
                level = exports.levels.DEBUG;
            }
            let startLine = parseInt(reqQuery.startline) || 0;
            let endLine = parseInt(reqQuery.endline) || self.logEntries.size();
            let startTimeStr = reqQuery.startdt || 0;
            let endTimeStr = reqQuery.enddt || new Date().getTime();
            let startTimestamp = new Date(startTimeStr).getTime();
            let endTimestamp = new Date(endTimeStr).getTime();
            let filtered = self.logEntries.clone();
            resolve(filtered.toArray().filter((entry) => {
                let levelMatch = entry.level <= level;
                let dateMatch = entry.time <= endTimestamp && entry.time >= startTimestamp;
                let lineMatch = entry.line <= endLine && entry.line >= startLine;
                return lineMatch && levelMatch && dateMatch;
            }));
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
router.get('/view/:logfile/:pageNum', (req, res, next) => {
    let logFile = new LogFile(req.params.logfile);
    logFile.on('ready', () => {
        let promises = [
            logFile.query(req.query),
            LogFile.getLogFileNames(LOG_DIR)
        ];
        Promise.all(promises).then((values) => {
            let nLines = logFile.logEntries.size();
            let records = LogFile.paginate(values[0], req.query.pagesize);
            res.render('logs', {
                title: req.params.logfile,
                logEntries: records[parseInt(req.params.pageNum) - 1],
                currentPage: parseInt(req.params.pageNum),
                nPages: records.length,
                logFiles: values[1],
                nLines: nLines,
                sysName: SYS_NAME,
                logDirec: LOG_DIR
            });
        });
    });
});

router.get('/api/:logfile/:pageNum', (req, res, next) => {
    let logFile = new LogFile(req.params.logfile);
    logFile.on('ready', () => {
        logFile.query(req.query).then((logEntries) => {
            let nLines = logFile.logEntries.size();
            let records = LogFile.paginate(logEntries, req.query.pagesize);
            res.json({
                title: req.params.logfile,
                logEntries: records[parseInt(req.params.pageNum) - 1],
                currentPage: parseInt(req.params.pageNum),
                nPages: records.length,
                pageSize: parseInt(req.query.pagesize) || DEFAULT_PAGE_SIZE,
                nLines: nLines,
                sysName: SYS_NAME,
                logDirec: LOG_DIR
            });
        })
        .catch((err) => {
            console.log(err.message);
        });
    });
});

module.exports = router;




