'use strict'

const fs = require('fs')
const dateFormat = require('dateformat')
const _ = require('lodash')

const constants = require('../../constants')
const buildRes = require('../helpers/build-res')

const DEFAULT_SPLIT_STR = '\n' // TODO put this in config

function parseLine (datetimePattern, levelPattern, timeFormatter) {
  return function (line) {
    const dateSplit = line.split(new RegExp(datetimePattern))
    const levelSplit = dateSplit[2].split(new RegExp(levelPattern))
    const levelObj = getLevel(levelSplit[1], constants.levels)
    const dateObj = new Date(dateSplit[1])
    return {
      text: levelSplit[2],
      level: levelObj.level,
      levelStr: levelObj.str,
      datetime: dateObj.getTime(),
      datetimeStr: dateFormat(dateObj, timeFormatter, true) // Added true for UTC time
    }
  }
}

const getLevelLowerCase = (levelStr, levelEnum) => Object.keys(levelEnum).some(key => key === levelStr)
  ? { level: levelEnum[levelStr], str: levelStr } : { level: constants.defaultLevel, str: constants.defaultLevelStr }

const getLevel = (levelStr, levelEnum) => getLevelLowerCase(levelStr.trim().toLowerCase(), levelEnum)

const isValidPagenum = (nLines, pageSize, pagenum) => Math.ceil(nLines / pageSize) >= pagenum

const Logfile = {
  create: function (filepath, config) {
    this.filepath = filepath
    this.config = config
    this.readFile()
    return this
  },
  readFile: function () {
    try {
      const data = fs.readFileSync(this.filepath)
      // Filter to avoid empty lines
      const lines = data.toString().split(DEFAULT_SPLIT_STR).filter(k => k.length > 0)
      this.loglines = lines.map(parseLine(this.config.datetimePattern,
                      this.config.levelPattern, this.config.timeFormatter))
    } catch (err) {
      throw new Error(`Failed to read ${this.filepath}`)
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
  query: function (queryParams) {
    const startdt = new Date(queryParams.startdt).getTime()
    const enddt = new Date(queryParams.enddt).getTime()
    const filtered = this.loglines.filter(logline => {
      const datetimeMatch = logline.datetime <= enddt && logline.datetime >= startdt
      const levelMatch = logline.level <= queryParams.level
      return datetimeMatch && levelMatch
    })
    if (!isValidPagenum(filtered.length, queryParams.pagesize, queryParams.pagenum) && filtered.length) { throw new Error('pagenum out of range') }
    // pages go from newest -> oldest so reverse the page chunks
    const loglines = _.chunk(filtered, queryParams.pagesize).reverse()[queryParams.pagenum - 1]
    return buildRes(true, `Queried ${this.filepath}`, loglines)
  },
  getAll: function () {
    return buildRes(true, `Retrieved all loglines for ${this.filepath}`, this.loglines)
  }
}

module.exports = Logfile
