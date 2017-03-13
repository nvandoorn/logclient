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

exports.defaultPageSize = 20;

exports.isoDtExp = /(\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z\])/;

exports.isoDtExpMatch = /\[(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z)\]/;

