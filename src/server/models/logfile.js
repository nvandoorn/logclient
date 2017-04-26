'use strict'

const fs = require('fs')
const dateFormat = require('dateformat')
const _ = require('lodash')
const async = require('async')

const constants = require('../../constants')
const buildRes = require('../helpers/build-res')

const DEFAULT_SPLIT_STR = '\n' // TODO put this in config

function parseLine (datetimePattern, levelPattern, timeFormatter) {
  return function (line, callback) {
    try {
      const dateSplit = line.split(new RegExp(datetimePattern))
      const levelSplit = dateSplit[2].split(new RegExp(levelPattern))
      const levelObj = getLevel(levelSplit[1], constants.levels)
      const dateObj = new Date(dateSplit[1])
      callback(null, {
        text: levelSplit[2],
        level: levelObj.level,
        levelStr: levelObj.str,
        datetime: dateObj.getTime(),
        datetimeStr: dateFormat(dateObj, timeFormatter, true) // Added true for UTC time
      })
    } catch (err) {
      callback(err)
    }
  }
}

const getLevelLowerCase = (levelStr, levelEnum) => Object.keys(levelEnum).some(key => key === levelStr)
  ? { level: levelEnum[levelStr], str: levelStr } : { level: constants.defaultLevel, str: constants.defaultLevelStr }

const getLevel = (levelStr, levelEnum) => getLevelLowerCase(levelStr.trim().toLowerCase(), levelEnum)

const isValidPagenum = (nLines, pageSize, pagenum) => Math.ceil(nLines / pageSize) >= pagenum

const Logfile = {
  readFile (callback) {
    fs.readFile(this.path, (err, data) => {
      if (err) callback(new Error(`Failed to read ${this.filePath}: ${err}`))
      const lines = data.toString().split(DEFAULT_SPLIT_STR).filter(k => k.length > 0)
      const parse = parseLine(this.config.datetimePattern, this.config.levelPattern, this.config.timeFormatter)
      async.map(lines, parse, (err, loglines) => {
        if (err) callback(err)
        else {
          this.loglines = loglines
          callback(null, this)
        }
      })
    })
  },
  query (queryParams) {
    const startdt = new Date(queryParams.startdt).getTime()
    const enddt = new Date(queryParams.enddt).getTime()
    const filtered = this.loglines.filter(logline => {
      const datetimeMatch = logline.datetime <= enddt && logline.datetime >= startdt
      const levelMatch = logline.level <= queryParams.level
      return datetimeMatch && levelMatch
    })
    if (!isValidPagenum(filtered.length, queryParams.pagesize, queryParams.pagenum) && filtered.length) { throw new Error('pagenum out of range') }
    // pages go from newest -> oldest so reverse the page chunks
    const loglines = _.chunk(filtered.reverse(), queryParams.pagesize)[queryParams.pagenum - 1]
    return buildRes(true, `Queried ${this.path}`, loglines ? loglines.reverse() : null)
  },
  getAll () {
    return buildRes(true, `Retrieved all loglines for ${this.path}`, this.loglines)
  }
}

module.exports = Logfile
