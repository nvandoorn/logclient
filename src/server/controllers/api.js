'use strict';

const express = require('express');
const router = express.Router();
const path = require('path');

const buildRes = require('../helpers/build-res');
const constants = require('../helpers/constants');

const Config = require('../models/config');
const Logfile = require('../models/logfile');
const folder = require('../models/folder');

const CONFIG_PATH = path.join(__dirname, '../../../config.json');

const config = Config.createConfig(CONFIG_PATH);

function failConfig(req, res, next){
    if(!config.blob.folders.length){
      res.json(buildRes(false, 'Folder config is empty', {}));
    }
    else{
      next();
    }
}

function normalizeFileReq(req, res, next){
  req.normalized = {
    logfile: req.query.logfile, // cannot be normalized
    pagenum: req.query.pagenum || 1,
    pagesize: parseInt(req.query.pagesize) || constants.defaultPageSize,
    startdt: parseInt(req.query.startdt) || new Date(0).getTime(), // TODO remove parseInt
    enddt: parseInt(req.query.enddt) || Date.now(),
    level: parseInt(req.query.level) || constants.defaultLevel
  }
  next();
}

router.route('/config')
  .get((req, res) => {
    res.json(config.readConfig());
  })
  .put((req, res) => {
    res.json(config.setConfig(req.body));
  });

// TODO Add support to use folders list
router.get('/directory', failConfig, (req, res) => {
  folder.getLogFileNames(config.blob.folders[0].directory).then(folders => {
    console.log(JSON.stringify(config));
    res.json({
      logFiles: folders
    });
  });
});

// TODO Add support to use folders list
router.get('/file', [failConfig, normalizeFileReq], (req, res) => {
  const logpath = path.join(config.blob.folders[0].directory, req.query.logfile);
  const logfile = Logfile.create(logpath, config.blob);
  try{
    const logentries = logfile.query(req.normalized);
    res.json(buildRes(true, 'Queried logfile', {
      logentries: logentries // TODO this should be a call to #query()
    }))
  }
  catch(err){
    res.json(buildRes(false, `Request failed: ${err.message}`))
  }
});


module.exports = router;




