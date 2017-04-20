'use strict'

const fs = require('fs')
const path = require('path')

const Logfile = require('./logfile')
const buildRes = require('../helpers/build-res')

const notReadyReply = dir => buildRes(false, `Directory ${dir} is not ready yet`, {})

const Directory = {
  create (dirPath, config) {
    const instance = Object.assign({
      dirPath: dirPath,
      config: config
    }, this)
    instance.readDir()
    return instance
  },
  readDir () {
    fs.readdir(this.dirPath, (err, list) => {
      if(err) reject(new Error(`Failed to list ${this.dirPath}: ${err.message}`))
      this.filelist = list.map((name, i) => ({ name: name, key: i }))
      Promise.all(list.map((name, i) => Logfile.create(path.join(this.dirPath, name), this.config, i)))
      .then(logfiles => {
        this.logfiles = logfiles
      }, err => { reject(err)  })
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
