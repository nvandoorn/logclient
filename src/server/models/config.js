'use strict'

const fs = require('fs-extra')
const buildRes = require('../helpers/build-res')

const Config = {
  create (configPath) {
    this.configPath = configPath
    this.blob = {}
    this.read()
    return this
  },
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
    const success = this.save(config)
    return buildRes(success, `Config set: ${success}`, config)
  },
  save (config) {
    try {
      fs.outputJsonSync(this.configPath, config)
    } catch (err) {
      console.log(`Failed to save config to ${this.configPath}`)
      return false
    }
    return true
  }
}

module.exports = Config
