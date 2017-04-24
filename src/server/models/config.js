'use strict'

const fs = require('fs-extra')
const buildRes = require('../helpers/build-res')
const _ = require('lodash')

const Config = {
  read () {
    const configExists = fs.existsSync(this.configPath)
    let toReturn = buildRes(true, 'Config file is empty', {})
    if (configExists) {
      try {
        const blob = fs.readJsonSync(this.configPath)
        this.blob = blob
        toReturn = buildRes(true, 'Config read', blob)
      } catch (err) {
        toReturn = buildRes(false, `Failed to read config ${err.message}`, {})
      }
    }
    return toReturn
  },
  set (config) {
    this.blob = config
    const success = this.save()
    return buildRes(success, `Config set: ${success}`, config)
  },
  save () {
    try {
      fs.outputJsonSync(this.configPath, this.blob)
    } catch (err) {
      console.log(`Failed to save config to ${this.configPath}`)
      return false
    }
    return true
  },
  addDir (dirEntry) {
    const dirExist = this.blob.directories.some(k => k.path === dirEntry.path)
    const dir = this.blob.directories
    if (!dirExist) {
      let key
      if (dir) {
        key = dir.slice(-1)[0].key + 1
      } else {
        key = 0
      }
      dir.push(Object.assign(dirEntry, {
        key: key,
        active: false
      }))
      this.save()
      return buildRes(true, `Added entry with name: ${dirEntry.name} and path ${dirEntry.path}`)
    } else {
      return buildRes(false, `Entry for path ${dirEntry.path} already exists`, {})
    }
  },
  listDirs () {
    return buildRes(true, 'Read directories from config',this.blob.directories)
  }
}

module.exports = Config
