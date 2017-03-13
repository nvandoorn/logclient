'use strict';

const express = require('express');
const router = express.Router();
const path = require('path');

const helpers = require('../helpers/helpers');
const buildRes = helpers.buildRes;
const constants = require('../helpers/constants');
const folderParser = require('../helpers/folderparser');

const Config = require('../models/config');
const LogFile = require('../models/logfile');

const CONFIG_PATH = path.join(__dirname, '../../../config.json');

const config = Config.createConfig(CONFIG_PATH);

function failConfig (req, res, next){
    if(!config.blob.folders.length){
      res.json(buildRes(false, 'Folder config is empty', {}));
    }
    else{
      next();
    }
}

router.route('/config')
  .get((req, res, next) => {
    res.json(config.readConfig());
  })
  .put((req, res, next) => {
    res.json(config.setConfig(req.body));
  });

// TODO Add support to use folders list
router.get('/directory', failConfig, (req, res, next) => {
  folderParser.getLogFileNames(config.blob.folders[0].directory).then(folders => {
    console.log(JSON.stringify(config));
    res.json({
      logFiles: folders
    });
  });
});

// TODO Add support to use folders list
router.get('/file', failConfig, (req, res, next) => {
  const logpath = path.join(config.blob.folders[0].directory, req.query.logfile);
  let logFile = new LogFile(logpath);
  logFile.on('ready', () => {
    logFile.query(req.query).then((logEntries) => {
      let nLines = logFile.logEntries.size();
      let records = LogFile.paginate(logEntries, req.query.pagesize);
      res.json({
        title: req.query.logfile,
        logEntries: records[parseInt(req.query.page) - 1],
        currentPage: parseInt(req.query.page),
        nPages: records.length,
        pageSize: parseInt(req.query.pagesize) || constants.defaultPageSize,
        nLines: nLines,
      });
    })
    .catch((err) => {
      console.log(err.message);
    });
  });
});

module.exports = router;




