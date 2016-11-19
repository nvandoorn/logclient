const events = require('events');
const helpers = require('../helpers/helpers');
const path = require('path');
const util = require('util');
const Heap = require('heap');

/**
 * Models a given LogFile
 */
class LogFile extends events.EventEmitter{
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
        exports.generateLogEntries(logPath).then((data) => {
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

module.exports = LogFile;
