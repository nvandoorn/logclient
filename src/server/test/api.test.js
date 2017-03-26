const assert = require('assert');
const isEqual = require('json-is-equal');
const path = require('path');

const http = require('./lib/http');
const get = http.get;
const post = http.post;
const put = http.put;

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
      put(CONFIG_ROUTE, config).then(body => {
        done(body.success ? null : new Error(`Request failed: ${body.msg}`));
      });
    });
  });

  describe('#query()', function(){
    const thisGet = () => get(FILE_ROUTE, { logfile: LOGFILE_NAME });
    it('should correctly parse the first line', function(done){
      const correct = {
        text: `You must be pretty desperate if you're looking at the logs`,
        level: constants.levels.INFO,
        levelStr: 'info',
        datetime: 1489387840000,
        datetimeStr: '6:50:40'
      };
      thisGet().then(body => {
        if(body.success && isEqual(body.data.logentries[0], correct)) done();
        else done(new Error('Request failed'));
      });
    });

    it('should default level on unknown level', function(){
      return thisGet().then(function(body){
        assert.strictEqual(body.data.logentries[4].level, constants.defaultLevel, 'level did not default');
      });
    });

    it('should default level string on unknown level', function(){
      return thisGet().then(function(body){
        assert.strictEqual(body.data.logentries[4].levelStr, constants.defaultLevelStr,
            'level string did not defualt');
      })
    });
  });
});
