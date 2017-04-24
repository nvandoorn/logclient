'use strict'

const fs = require('fs-extra')
const buildRes = require('../helpers/build-res')
const _ = require('lodash')

const getDirObjectByPath = (dirs, dirEntry) => dirs.find(k => k.path === dirEntry.path)
const getDirObjectByKey = (dirs, dirEntry) => dirs.find(k => k.key === dirEntry.key)

const Config = {
  read () {
    const configExists = fs.existsSync(this.configPath)
    let toReturn = buildRes(true, 'Config file is empty', {})
    if (configExists) {
      try {
        const blob = fs.readJsonSync(this.configPath)
        this.blob = blob
        this.dirs = this.blob.directories
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
    const dirExist = getDirObjectByPath(this.dirs, dirEntry)
    if (!dirExist) {
      let key
      const lastDirEntry = dir.slice(-1)[0]
      if (lastDirEntry) {
        key = lastDirEntry + 1
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
  modifyDir (dirEntry) {
    const toModify = getDirObjectByKey(this.dirs, dirEntry)
    if (toModify) {
      toModify.name = dirEntry.name
      toModify.path = dirEntry.path
      this.save()
      return buildRes(true, `Modified directory entry with key ${dirEntry.key}` )
    } else {
      return buildRes(true, `No directory entry found with key ${dirEntry.key}`)
    }
  },
  listDirs () {
    return buildRes(true, 'Read directories from config',this.blob.directories)
  }
}

module.exports = Config
