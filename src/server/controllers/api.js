'use strict'

const express = require('express')
const router = express.Router()
const path = require('path')

const constants = require('../../constants')
const buildRes = require('../helpers/build-res')

const Config = require('../models/config')
const Directory = require('../models/directory')

const CONFIG_PATH = path.join(__dirname, '../../../config.json')
const CONFIG_ROUTE = '/config'
const FILE_ROUTE = '/file'
const DIR_ROUTE = '/directory'

const normalizeReq = req => ({
  key: parseInt(req.query.key),
  pagenum: req.query.pagenum || 1,
  pagesize: parseInt(req.query.pagesize) || constants.defaultPageSize,
  startdt: parseInt(req.query.startdt) || new Date(0).getTime(), // TODO remove parseInt
  enddt: parseInt(req.query.enddt) || Date.now(), // TODO this logic will fail with 0
  level: !isNaN(parseInt(req.query.level)) ? parseInt(req.query.level) : constants.defaultLevel
})

module.exports = function () {
  const config = Object.assign({
    configPath: CONFIG_PATH,
    blob: {}
  }, Config)
  config.read()

  let dir = Object.assign({
    dirPath: config.blob.directories.find(k => k.active).path,
    config: config.blob
  }, Directory)
  dir.readDir()

  return {
    readConfig: (req, res) => res.json(config.read()),
    setConfig: (req, res) => res.json(config.set(req.body)),
    listDirs: (req, res) => res.json(config.listDirs()),
    addDir: (req, res) => res.json(config.addDir(req.body)),
    modifyDir: (req, res) => res.json(config.modifyDir(req.body)),
    deleteDir: (req, res) => res.json(config.deleteDir(req.body)),
    queryActiveFile: (req, res) => res.json(dir.query(normalizeReq(req))),
    listActiveDir: (req, res) => res.json(dir.list()),
    setActiveDir: (req, res) => {
      const dirPath = config.blob.directories.find(k => k.key === parseInt(req.body.key)).path
      return res.json(dir.readDir(dirPath))
    }
  }
}


