'use strict';

const express = require('express');
const router = express.Router();
const path = require('path');

const helpers = require('../helpers/helpers');
const buildRes = helpers.buildRes;
const constants = require('../helpers/constants');
const folderParser = require('../helpers/folderparser');

const Config = require('../models/config');
const Logfile = require('../models/logfile');

const CONFIG_PATH = path.join(__dirname, '../../../config.json');

const config = Config.createConfig(CONFIG_PATH);

function failConfig (req, res, next){
    if(!config.blob.folders.length){
      debugger;
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
  const logfile = Logfile.create(logpath, config.blob);
  res.json(buildRes(true, 'Queried logfile', {
    logentries: logfile.getAll() // TODO this should be a call to #query()
  }))
});


module.exports = router;




