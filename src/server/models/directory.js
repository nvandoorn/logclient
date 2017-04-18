'use strict'

const fs = require('fs')
const path = require('path')

const Logfile = require('./logfile')
const buildRes = require('../helpers/build-res')

const Directory = {
  create (dirPath, config) {
    return Object.assign({
      dirPath: dirPath,
      config: config
    }, this).readDir()
  },
  readDir () {
    return new Promise((resolve, reject) => {
      fs.readdir(this.dirPath, (err, list) => {
        if(err) reject(new Error(`Failed to list ${this.dirPath}: ${err.message}`))
        this.filelist = list.map((name, i) => ({ name: name, key: i }))
        Promise.all(list.map((name, i) => Logfile.create(path.join(this.dirPath, name), this.config, i)))
        .then(logfiles => {
          this.logfiles = logfiles
          resolve(this)
        })
      })
    })
  },
  query (params) {
    const logfile = this.logfiles.find(k => k.key === params.key)
    if(logfile) return logfile.query(params)
    else return buildRes(false, `Failed to find logfile with key ${params.key}`, {})
  },
  list () {
    return buildRes(true, `Retrieved listing for ${this.dirPath}`, this.filelist)
  }
}

module.exports = Directory
