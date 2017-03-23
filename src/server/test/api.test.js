const assert = require('assert');
const isEqual = require('json-is-equal');
const path = require('path');
const request = require('request');

const constants = require('../helpers/constants');
const createServer = require('../../../scripts/www');
const Logfile = require('../models/logfile');

const LOGFILE_PATH = path.join(__dirname, './fixtures');
const LOGFILE_NAME = 'testlog.log';
const TEST_PORT = 5000;
const BASE_ROUTE = `http://localhost:${TEST_PORT}/api`;
const CONFIG_ROUTE = `${BASE_ROUTE}/config`;
const FILE_ROUTE = `${BASE_ROUTE}/file`

describe('REST API', function(){
  const server = createServer(TEST_PORT);
  describe('#config()', function(){
    const config = {
      datetimePattern: constants.defaultDatetimePattern.toString(),
      levelPattern: constants.defaultLevelPattern.toString(),
      timeFormatter: constants.defaultTimeFormatter,
      folders: [{
        name: "Test Fixture",
        directory: LOGFILE_PATH
      }]
    };
    it('should successfully set the config', function(done){
      request({
        url: CONFIG_ROUTE,
        method: 'PUT',
        json: config
      }, function(err, response, body){
        done(body.success ? null : new Error(`Request failed: ${body.msg}`))
      })
    })
  });

  describe('#query()', function(){
    const fileGet = (fileRoute, params) => new Promise((resolve, reject) => {
      request({
        url: fileRoute,
        method: 'GET',
        qs: { logfile: params.logfile }
      }, function(err, response, body){
        const parsedBody = JSON.parse(body);
        if(err) reject(err);
        resolve(parsedBody)
      })
    });
    const thisGet = () => fileGet(FILE_ROUTE, { logfile: LOGFILE_NAME });
    it('should correctly parse the first line', function(done){
      const correct = {
        text: `You must be pretty desperate if you're looking at the logs`,
        level: constants.levels.INFO,
        levelStr: 'info',
        datetime: 1489387840000,
        datetimeStr: '11:50:40'
      };
      thisGet().then(body => {
        if(body.success && isEqual(body.data.logentries[0], correct)) done();
        else done(new Error('Request failed'));
      });
    });

    it('should default level on unknown level', function(){
      thisGet().then(body => {
        assert.equal(body.data.logentries[4], constants.defaultLevel);
      });
    });

    it('should default level string on unknown level', function(){
      thisGet().then(body => {
        assert.equal(body.data.logentries[4].levelStr, constants.defaultLevelStr);
      })
    });
  });
});
