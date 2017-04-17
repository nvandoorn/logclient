'use strict'

const express = require('express')
const router = express.Router()
const path = require('path')

const constants = require('../../constants')
const buildRes = require('../helpers/build-res')

const Config = require('../models/config')
const Logfile = require('../models/logfile')
const folder = require('../models/folder')

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
    pagenum: req.query.pagenum || 1,
    pagesize: parseInt(req.query.pagesize) || constants.defaultPageSize,
    startdt: parseInt(req.query.startdt) || new Date(0).getTime(), // TODO remove parseInt
    enddt: parseInt(req.query.enddt) || Date.now(),
    level: parseInt(req.query.level) || constants.defaultLevel
  }
  next()
}

let logfiles = []
folder(config.blob.folders[0].directory).then(resp => {
  logfiles = resp.data.map(k => Logfile.create(path.join(config.blob.folders[0].directory, k), config.blob))
})

router.route('/config')
  .get((req, res) => {
    res.json(config.read())
  })
  .put((req, res) => {
    res.json(config.set(req.body))
  })

// TODO Add support to use folders list
router.get('/directory', failConfig, (req, res) => {
  folder(config.blob.folders[0].directory).then(resp => {
    res.json(resp)
  })
})

// TODO Add support to use folders list
router.get('/file', [failConfig, normalizeFileReq], (req, res) => {
  const logfile = logfiles.find(k => k.filepath === path.join(config.blob.folders[0].directory, req.query.logfile))
  console.log(logfiles.map(k => k.filepath))
  try {
    res.json(logfile.query(req.normalized))
  } catch (err) {
    res.json(buildRes(false, `Request failed: ${err.message}`))
  }
})

module.exports = router
