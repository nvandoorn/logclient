'use strict';

const path = require('path');
const fs = require('fs-extra');

const helpers = require('../helpers/helpers');
const buildRes = helpers.buildRes;


const Config = {
  createConfig: function(configPath){
    this.configPath = configPath;
    this.blob = {};
    this.readConfig();
    return this;
  },
  readConfig: function(){
    const configExists = fs.existsSync(this.configPath);
    let toReturn = buildRes(true, 'Config file is empty', {});
    if(configExists){
      try{
        const blob = fs.readJsonSync(this.configPath);
        this.blob = blob;
        toReturn = buildRes(true, 'Config read', blob);
      }
      catch(err){
        toReturn = buildRes(false, `Failed to read config ${err.message}`, {});
      }
    }
    return toReturn;
  },
  setConfig: function(config){
    this.blob = config;
    console.log(JSON.stringify(this.blob));
    const success = this.saveConfig(config);
    return buildRes(success, `Config set: ${success}`, config);
  },
  saveConfig: function(config){
    try{
      fs.outputJsonSync(this.configPath, config);
    }
    catch(err){
      console.log(`Failed to save config to ${this.configPath}`);
      return false
    }
    return true;
  }
}

module.exports = Config;
