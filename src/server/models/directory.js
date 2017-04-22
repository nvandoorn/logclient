'use strict'

const fs = require('fs')
const path = require('path')
const async = require('async')

const Logfile = require('./logfile')
const buildRes = require('../helpers/build-res')

const notReadyReply = dir => buildRes(false, `Directory ${dir} is not ready yet`, {})

const Directory = {
  readDir () {
    fs.readdir(this.dirPath, (err, list) => {
      this.filelist = list.map((name, i) => ({
        name: name,
        key: i,
        path: path.join(this.dirPath, name),
        config: this.config
      }))
      // TODO for some reason this.filelist is getting mutated?
      async.map(this.filelist, (item, callback) => {
        Object.assign(item, Logfile).readFile(callback)
      }, (err, logfiles) => {
        console.log('nice we finished')
        this.logfiles = logfiles
      })
    })
  },
  query (params) {
    if (this.logfiles) {
      const logfile = this.logfiles.find(k => k.key === params.key)
      if(logfile) return logfile.query(params)
      else return buildRes(false, `Failed to find logfile with key ${params.key}`, {})
    } else {
      return notReadyReply(this.dirPath)
    }
  },
  list () {
    return this.filelist ?
      buildRes(true, `Retrieved listing for ${this.dirPath}`, this.filelist) : notReadyReply(this.dirPath)
  }
}

module.exports = Directory
