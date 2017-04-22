'use strict'

const express = require('express')
const router = express.Router()
const path = require('path')
const blocked = require('blocked')

const constants = require('../../constants')
const buildRes = require('../helpers/build-res')

const Config = require('../models/config')
const Logfile = require('../models/logfile')
const Directory = require('../models/directory')

const CONFIG_PATH = path.join(__dirname, '../../../config.json')
const FILE_ROUTE = '/file'
const DIR_ROUTE = '/directory'

const normalizeFileReq = req => ({
  key: parseInt(req.query.key),
  pagenum: req.query.pagenum || 1,
  pagesize: parseInt(req.query.pagesize) || constants.defaultPageSize,
  startdt: parseInt(req.query.startdt) || new Date(0).getTime(), // TODO remove parseInt
  enddt: parseInt(req.query.enddt) || Date.now(), // TODO this logic will fail with 0
  level: !isNaN(parseInt(req.query.level)) ? parseInt(req.query.level) : constants.defaultLevel
})

router.route('/config')
  .get((req, res) => {
    res.json(config.read())
  })
  .put((req, res) => {
    res.json(config.set(req.body))
  })

// TODO rid thee global scope
const config = Config.create(CONFIG_PATH)
const dir = Object.assign({
  dirPath: config.blob.directories.find(k => k.active).path,
  config: config.blob
}, Directory)
dir.readDir()

router.get(FILE_ROUTE, (req, res) => {
  res.json(dir.query(normalizeFileReq(req)))
})

router.get(DIR_ROUTE, (req, res) => {
  res.json(dir.list())
})

module.exports = router
