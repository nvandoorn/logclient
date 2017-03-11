'use strict';

const fs = require('fs');
const async = require('async');
const events = require('events');
const express = require('express');
const path = require('path');
const util = require('util');
const walk = require('walk');
const Heap = require('heap');
const clone = require('clone');
const process = require('process');
const router = express.Router();

const helpers = require('../helpers/helpers');
const constants = require('../helpers/constants');
const lineParser = require('../helpers/lineparser');
const folderParser = require('../helpers/folderparser');


/**
 * Models a given LogFile
 */
class LogFile extends events.EventEmitter{
    /**
     * Generates JSON object for a given log file
     *
     * @param logPath: string
     *  Path to log file
     * @returns: {Promise}
     *  Resolves with a list of JSON objects
     */
    static generateLogEntries(logPath){
       return new Promise((resolve, reject) => {
            async.waterfall([
                    (next) => {
                        fs.readFile(path.join(constants.logDir, logPath), (err, data) => {
                            next(null, data.toString());
                        });
                    },
                    (data, next) => {
                        let split = data.split(constants.isoDtExp);
                        let lines = [];
                        for(let i = 1; i < split.length; i += 2){
                            lines.push(split[i] + split[i+1]);
                        }
                        next(null, lines);
                    },
                    (data, done) => {
                        done(null, lineParser.parseLines(data));
                    }],
                (err, results) => {
                    resolve(results);
                }
            );
        });
    }

    static paginate(toPaginate, pageSize){
        pageSize = parseInt(pageSize) || constants.defaultPageSize;
        let toPaginateHeap = LogFile.lineEntryHeapSort(toPaginate);
        let toReturn = [];
        while(!toPaginateHeap.empty()){
            let chunk = [];
            while(chunk.length < pageSize && !toPaginateHeap.empty()){
                chunk.push(toPaginateHeap.pop());
            }
            toReturn.push(chunk.reverse());
        }
        return toReturn;
    }

    static lineEntryHeapSort(lineEntries){
        let heap = new Heap((a, b) => {
            return b.line - a.line;
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
                level = constants.levels.DEBUG;
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

router.get('/api/:logdirec', (req, res, next) => {
  res.json({
      logFiles: folderParser.getLogFileNames(constants.logDir) 
  })
})

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
                pageSize: parseInt(req.query.pagesize) || constants.defaultPageSize,
                nLines: nLines,
                sysName: constants.sysName,
                logDirec: constants.logDir
            });
        })
        .catch((err) => {
            console.log(err.message);
        });
    });
});

module.exports = router;




