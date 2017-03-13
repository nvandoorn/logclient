const constants = require('./constants');
const helpers = require('./helpers');
const Heap = require('heap');

exports.parseLines = (lines)  => {
  let logEntries = new Heap((a, b) => {
    return b.line - a.line;
  });
  let index = 0;

  for(let logEntry of lines){
    logEntries.push(exports.parseLine(logEntry, ++index))
  }
  return logEntries;
};

exports.parseLine = (line, index) => {
  let timeStr, levelStr, timestamp, level, classStr;
  let timeRegex = new RegExp(constants.isoDtExpMatch);
  let levelRegex = new RegExp(/\[(\w+)\]/);
  try{
    timeStr = timeRegex.exec(logEntry)[1];
    timestamp = new Date(timeStr).getTime();
  }
  catch(err){
    timestamp = new Date().getTime()
  }

  try{
    levelStr = levelRegex.exec(line)[1];
    let keys = Object.keys(constants.levels);
    level = keys.indexOf(levelStr);
    if(level < 0){
      throw new Error('Invalid level');
    }
  }

  catch(err){
    level = constants.levels.DEBUG;
  }
  classStr = exports.getClass(level);
  return {
    text: line,
    time: timestamp,
    level: level,
    classStr: classStr,
    line: index
  };
};

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
exports.getClass = (level) => {
  let keys = Object.keys(constants.levels);
  let levelInt = level;
  if(helpers.isUndefined(level)){
    levelInt = constants.levels.DEBUG;
  }
  return `logline-${keys[levelInt].toLowerCase()}`;
};


