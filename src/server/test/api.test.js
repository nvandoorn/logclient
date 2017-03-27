'use strict';

const assert = require('chai').assert;
const path = require('path');

const http = require('./lib/http');
const get = http.get;
const put = http.put;

const constants = require('../helpers/constants');
const createServer = require('../../../scripts/server');

const LOGFILE_PATH = path.join(__dirname, './fixtures');
const LOGFILE_NAME = 'testlog.log';
const TEST_PORT = 5000;
const BASE_ROUTE = `http://localhost:${TEST_PORT}/api`;
const CONFIG_ROUTE = `${BASE_ROUTE}/config`;
const FILE_ROUTE = `${BASE_ROUTE}/file`;
const DIRECTORY_ROUTE = `${BASE_ROUTE}/directory`;

describe('REST API', function(){

  const server = createServer(TEST_PORT); // eslint-disable-line
  describe('#config()', function(){
    const config = {
      datetimePattern: constants.defaultDatetimePattern.toString().slice(1, -1),
      levelPattern: constants.defaultLevelPattern.toString().slice(1, -1),
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

  describe('#directory()', function(){
    it(`should contain ${LOGFILE_NAME}`, function(){
      return get(DIRECTORY_ROUTE).then(body => {
        assert.include(body.data, LOGFILE_NAME);
      })
    })
  });

  describe('#query()', function(){
    const thisGet = () => get(FILE_ROUTE, { logfile: LOGFILE_NAME });
    it('should correctly parse the first line', function(){
      const correct = {
        text: `You must be pretty desperate if you're looking at the logs`,
        level: constants.levels.INFO,
        levelStr: 'info',
        datetime: 1489387840000,
        datetimeStr: '6:50:40'
      };
      return thisGet().then(body => {
        assert(body.success);
        assert.deepEqual(body.data[0], correct, 'did not correctly parse logline');
      });
    });

    it('should default level on unknown level', function(){
      return thisGet().then(function(body){
        assert(body.success);
        assert.strictEqual(body.data[4].level, constants.defaultLevel, 'level did not default');
      });
    });

    it('should default level string on unknown level', function(){
      return thisGet().then(function(body){
        assert(body.success);
        assert.strictEqual(body.data[4].levelStr, constants.defaultLevelStr,
            'level string did not defualt');
      })
    });
  });
});
