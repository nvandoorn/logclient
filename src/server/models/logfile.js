'use strict';

const fs = require('fs');
const async = require('async');
const events = require('events');
const path = require('path');
const util = require('util');
const walk = require('walk');
const Heap = require('heap');
const clone = require('clone');
const dateformat = require('dateformat');

const helpers = require('../helpers/helpers');
const constants = require('../helpers/constants');
const lineParser = require('../helpers/lineparser');

const DEFAULT_LEVEL = constants.DEBUG;
const DEFAULT_LEVEL_STR = 'debug'; // TODO less jank here

function parseLine(line, datetimePattern, levelPattern, datetimeFormatter){
  const dateSplit = line.split(datetimePattern);
  const levelSplit = line.split(levelPattern);
  const levelObj = getLevel(levelSplit[0], constants.levels);
  const dateObj = new Date(dateSplit[0]);
  return {
    text: levelSplit[1],
    level: levelObj.level,
    levelStr: levelObj.str,
    date: dateObj.getTime(),
    dateStr: dateFormat(dateObj, datetimeFormatter)
  }
}

// TODO remove this filthy jank
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

const Logfile = {
  create: function(filepath, config){
    this.filepath = filepath;
    this.config = config;
    return this;
  },
  readFile: function(){
    fs.readFile(this.filepath, (err, data) => {
      if(err) throw err;
      this.loglines = parseLines(data, this.config.datetimePattern,
                      this.config.levelPattern, this.config.timeFormatter);
    });
  }
  query: function(queryParmas){

  },
  paginate: function(){

  }
};

module.exports = Logfile;
