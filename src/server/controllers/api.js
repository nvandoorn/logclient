'use strict'

const express = require('express')
const router = express.Router()
const path = require('path')

const constants = require('../../constants')
const buildRes = require('../helpers/build-res')

const Config = require('../models/config')
const Logfile = require('../models/logfile')
const Directory = require('../models/directory')

const CONFIG_PATH = path.join(__dirname, '../../../config.json')

const config = Config.create(CONFIG_PATH)

function failConfig (req, res, next) {
  if (!config.blob.folders.length) {
    res.json(buildRes(false, 'Folder config is empty', {}))
  } else {
    next()
  }
}

function normalizeFileReq (req, res, next) {
  req.normalized = {
    key: parseInt(req.query.key),
    pagenum: req.query.pagenum || 1,
    pagesize: parseInt(req.query.pagesize) || constants.defaultPageSize,
    startdt: parseInt(req.query.startdt) || new Date(0).getTime(), // TODO remove parseInt
    enddt: parseInt(req.query.enddt) || Date.now(),
    level: parseInt(req.query.level) || constants.defaultLevel
  }
  next()
}

router.route('/config')
  .get((req, res) => {
    res.json(config.read())
  })
  .put((req, res) => {
    res.json(config.set(req.body))
  })

Directory.create(config.blob.folders[0].directory, config.blob).then(dir => {
  router.get('/file', [failConfig, normalizeFileReq], (req, res) => {
    res.json(dir.query(req.normalized))
  })
  router.get('/directory', (req, res) => {
    res.json(dir.list())
  })
})


module.exports = router
