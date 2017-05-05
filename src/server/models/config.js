'use strict'

const fs = require('fs-extra')
const buildRes = require('../helpers/build-res')
const _ = require('lodash')

const getDirObjectByPath = (dirs, dirEntry) => dirs.find(k => k.path === dirEntry.path)
const getDirObjectByKey = (dirs, dirEntry) => dirs.find(k => k.key === dirEntry.key)
const noDirEntryFound = key => buildRes(false, `No directory found for key ${key}`, {})

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
  getBaseBlob () {
    if (this.blob) {
      const noConfigBlob = Object.assign({}, this.blob)
      delete noConfigBlob.directories
      return buildRes(true, 'Read config', noConfigBlob)
    } else return buildRes(false, 'No config blob', {})
  },
  set (config) {
    _.merge(this.blob, config)
    const success = this.save()
    return buildRes(success, `Config set: ${success}`, this.config)
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
      const lastDirEntry = this.dirs.slice(-1)[0]
      const key = lastDirEntry ? lastDirEntry.key + 1 : 0
      this.dirs.push(Object.assign(dirEntry, {
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
      _.merge(toModify, dirEntry)
      this.save()
      return buildRes(true, `Modified directory entry with key ${dirEntry.key}`)
    } else return noDirEntryFound(dirEntry.key)
  },
  deleteDir (dirEntry) {
    const dirExist = getDirObjectByKey(this.dirs, dirEntry)
    if (dirExist) {
      this.blob.directories = this.dirs.filter(k => k.key !== dirEntry.key)
      this.dirs = this.blob.directories
      this.save()
      return buildRes(true, `Removed directory with key ${dirEntry.key}`, {})
    } else return noDirEntryFound(dirEntry.key)
  },
  listDirs () {
    return buildRes(true, 'Read directories from config', this.blob.directories)
  }
}

module.exports = Config
