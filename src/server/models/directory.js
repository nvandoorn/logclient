'use strict'

const fs = require('fs')
const path = require('path')
const async = require('async')

const Logfile = require('./logfile')
const buildRes = require('../helpers/build-res')

const notReadyReply = dir => buildRes(false, `Directory ${dir} is not ready yet`, {})

const Directory = {
  readDir (dirPath) {
    try{
      this.logfiles = null
      if(dirPath) this.dirPath = dirPath
      fs.readdir(this.dirPath, (err, list) => {
        if (err) throw err
        this.filelist = list.map((name, i) => ({
          name: name,
          key: i,
          path: path.join(this.dirPath, name)
        }))
        // TODO make this more terse
        const filelistConfig = this.filelist.map(dirEntry => {
          const dirEntryConfig = Object.create(dirEntry)
          dirEntryConfig.config = this.config
          return dirEntryConfig
        })
        async.map(filelistConfig, (item, callback) => {
          Object.assign(Object.create(item), Logfile).readFile(callback)
        }, (err, logfiles) => {
          if (err) throw err
          this.logfiles = logfiles
        })
      })
      return buildRes(true, `Caching directory ${this.dirPath}`, {})
    } catch (err) {
      return buildRes(false, `Failed to cahce directory ${this.dirPath}: ${err.message}`, {})
    }
  },
  query (params) {
    if (this.logfiles) {
      const logfile = this.logfiles.find(k => k.key === params.key)
      if (logfile) return logfile.query(params)
      else return buildRes(false, `Failed to find logfile with key ${params.key}`, {})
    } else {
      return notReadyReply(this.dirPath)
    }
  },
  list () {
    return this.filelist
      ? buildRes(true, `Retrieved listing for ${this.dirPath}`, this.filelist) : notReadyReply(this.dirPath)
  }
}

module.exports = Directory
