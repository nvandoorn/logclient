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
    it('should successfully set the config', function(){
      return put(CONFIG_ROUTE, config).then(body => {
        assert(body.success, 'failed to set config');
      });
    });
    it('should successfully get the same config', function(){
      return get(CONFIG_ROUTE).then(body => {
        assert(body.success, 'failed to get config');
        assert.deepEqual(body.data, config, 'configs are not equal');
      })
    })
  });

  describe('#directory()', function(){
    it(`should contain ${LOGFILE_NAME}`, function(){
      return get(DIRECTORY_ROUTE).then(body => {
        assert.include(body.data, LOGFILE_NAME, `directory list did not include ${LOGFILE_NAME}`);
      })
    })
  });

  describe('#query()', function(){
    const thisGet = () => get(FILE_ROUTE, { logfile: LOGFILE_NAME });
    const bodyFailMsg = 'query request failed';
    it('should correctly parse the first line', function(){
      const correct = {
        text: `You must be pretty desperate if you're looking at the logs`,
        level: constants.levels.INFO,
        levelStr: 'info',
        datetime: 1489387840000,
        datetimeStr: '6:50:40'
      };
      return thisGet().then(body => {
        assert(body.success, bodyFailMsg);
        assert.deepEqual(body.data[0], correct, 'did not correctly parse logline');
      });
    });

    it('should return an empty list for a future date range', function(){
      return get(FILE_ROUTE, {
        logfile: LOGFILE_NAME,
        startdt: Date.now() + 1 * 1000 * 60,
        enddt: Date.now() + 2 * 1000 * 60
      }).then(body => {
        assert(body.success, bodyFailMsg);
        assert(!body.data, 'returned non-empty list for future date query'); // TODO this should check length
      })
    })

    it('should default level on unknown level', function(){
      return thisGet().then(function(body){
        assert(body.success, bodyFailMsg);
        assert.strictEqual(body.data[4].level, constants.defaultLevel, 'level did not default');
      });
    });

    it('should default level string on unknown level', function(){
      return thisGet().then(function(body){
        assert(body.success, bodyFailMsg);
        assert.strictEqual(body.data[4].levelStr, constants.defaultLevelStr,
            'level string did not defualt');
      })
    });
  });
});
