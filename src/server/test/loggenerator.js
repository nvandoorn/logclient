const path = require('path');
const winston = require('winston');
const util = require('util');

// Logger operates in 3 different modes
const modes = {
  FILE: 0, // Only log to file
  CONSOLE: 1, // Only log to console
  BOTH: 2 // Log to both file and console
};

const maxFileSizeMBytes = 5;
const nMaxFiles = 5;

/*
 * Constructs a new Logger
 *
 * @param mode: integer (enum)
 *  Mode of Logger operation (see above)
 *
 * Params following this are only needed
 * when Logger is running in modes.FILE
 * or modes.BOTH
 * 
 * @param filepath: string
 *  Path including filename to log file
 * @param maxSizeMBytes: integer or float
 *  Max filesize in mega bytes of log file
 * @param maxFiles: integer or float
 *  Maximum number of log files  
 */
function Logger(mode, filepath){
  var preppendToFilename = function(filepath, toPreppend){
    var split = filepath.split('/');
    var filename = split[split.length - 1];
    split[split.length - 1] = toPreppend + filename;
    return split.join('/');
  };

  var timestamp = function(){
    var now = new Date();
    return now.toISOString().split('.')[0] + 'Z';
  };

  var formatter = function(options){
    return util.format('[%s] [%s]: %s', timestamp(),
      options.level.toUpperCase(),
      undefined !== options.message ? options.message : '');
  };

  winston.emitErrs = true;
  var handlers = [ ];
  // Append file handler if needed
  if(mode === modes.FILE || mode === modes.BOTH){
    // Push a debug handler
    handlers.push(
      new winston.transports.File({
        name: 'debug logs',
        level: 'debug',
        filename: preppendToFilename(filepath, 'debug_'),
        handleExceptions: true,
        json: false,
        maxsize: maxFileSizeMBytes * 1024 * 1024,
        maxFiles: nMaxFiles,
        colorize: false,
        formatter: formatter
      })
    );

    handlers.push(
      new winston.transports.File({
        name: 'friendly logs',
        level: 'info',
        filename: filepath,
        handleExceptions: true,
        json: false,
        maxsize: maxFileSizeMBytes * 1024 * 1024,
        maxFiles: nMaxFiles,
        colorize: false,
        formatter: formatter
      })
    )
  }
  // Append console handler if needed
  if(mode === modes.CONSOLE || mode === modes.BOTH){
    handlers.push(
      new winston.transports.Console({
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
        formatter: formatter
      })
    );
  }
  // Create the logger with our
  // handlers attached
  this.logs = new winston.Logger({
    transports: handlers,
    exitOnError: false
  });
}

let logger = new Logger(2, '/var/log/clientlog/debug_livelog.log').logs;

let logInfo = function(){
  logger.error('Hello world');
  logger.warn('Lovely weather we\'re having');
  logger.debug('That\'s all for now folks');
  logger.info('You must be pretty desperate if you\'re looking at the logs');
};

let interval = setInterval(logInfo, 500);
