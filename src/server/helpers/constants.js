'use strict'

/**
 *  Enum for log levels
 *
 * @type {{ERROR: number, WARN: number, INFO: number, VERBOSE: number, DEBUG: number}}
 */
exports.levels = {
  error: 0,
  warn: 1,
  info: 2,
  verbose: 3,
  debug: 4
}

exports.defaultLevel = exports.levels.debug

exports.defaultLevelStr = 'debug'

exports.defaultPageSize = 20

exports.defaultDatetimePattern = /\[(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z)\]/

exports.defaultTimeFormatter = 'h:MM:ss'

exports.defaultLevelPattern = /\[([\w\s]+|\w+)\]:\s/
