'use strict';

const fs = require('fs');
const path = require('path');
const dateFormat = require('dateformat');
const _ = require('lodash');

const helpers = require('../helpers/helpers');
const constants = require('../helpers/constants');

const DEFAULT_LEVEL = constants.defaultLevel;
const DEFAULT_LEVEL_STR = constants.defaultLevelStr;
const DEFAULT_SPLIT_STR = '\n'; // TODO put this in config

function parseLine(datetimePattern, levelPattern, timeFormatter){
  return function(line){
    const dateSplit = line.split(new RegExp(datetimePattern.slice(1,-1)));
    const levelSplit = dateSplit[2].split(new RegExp(levelPattern.slice(1, -1)));
    const levelObj = getLevel(levelSplit[1], constants.levels);
    const dateObj = new Date(dateSplit[1]);
    return {
      text: levelSplit[2],
      level: levelObj.level,
      levelStr: levelObj.str,
      datetime: dateObj.getTime(),
      datetimeStr: dateFormat(dateObj, timeFormatter, true) // Added true for UTC time
    }
  }
}

// TODO remove this filthy jank (de-jank?)
function getLevel(levelStr, levelEnum){
  for(let key in levelEnum){
    if(levelStr.trim().toLowerCase().includes(key.toLowerCase())){
      return {
        level: levelEnum[key],
        str: key.toLowerCase()
      }
    }
  }
  return {
    level: DEFAULT_LEVEL,
    str: DEFAULT_LEVEL_STR
  }
}

const isValidPagenum = (nLines, pageSize, pagenum) => Math.ceil(nLines/pageSize) >= pagenum;

const Logfile = {
  create: function(filepath, config){
    this.filepath = filepath;
    this.config = config;
    this.readFile();
    return this;
  },
  readFile: function(){
    try{
      const data = fs.readFileSync(this.filepath);
      // Filter to avoid empty lines
      const lines = data.toString().split(DEFAULT_SPLIT_STR).filter(k => k.length > 0);
      this.loglines = lines.map(parseLine(this.config.datetimePattern,
                      this.config.levelPattern, this.config.timeFormatter));
    }
    catch(err){
    }
  },
  /**
   * queryParams: {
   *  logfile: path (string),
   *  pagenum: integer,
   *  pagesize: integer,
   *  startdt: datetime string
   *  enddt: datetime string
   *  level: one of log level enum
   * }
   *
  */
  query: function(queryParams){
    const startdt = new Date(queryParams.startdt).getTime();
    const enddt = new Date(queryParams.enddt).getTime();
    const filtered = this.loglines.filter(logline => {
      const datetimeMatch = logline.datetime <= enddt && logline.datetime >= startdt;
      const levelMatch = logline.level <= queryParams.level;
      return datetimeMatch && levelMatch;
    });
    if(!isValidPagenum(filtered.length, queryParams.pagesize, queryParams.pagenum))
      throw new Error('pagenum out of range');
    // pages go from newest -> oldest so reverse the page chunks
    return _.chunk(filtered, queryParams.pagesize).reverse()[queryParams.pagenum - 1];
  },
  getAll: function(){
    return this.loglines;
  }
};

module.exports = Logfile;

