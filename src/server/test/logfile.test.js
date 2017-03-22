const assert = require('assert');
const isEqual = require('json-is-equal');
const path = require('path');

const constants = require('../helpers/constants');
const Logfile = require('../models/logfile');

describe('Logline', function(){
  describe('#getAll()', function(){
    const logpath = path.join(__dirname, './fixtures/testlog.log');
    const config = {
      datetimePattern: constants.defaultDatetimePattern,
      levelPattern: constants.defaultLevelPattern,
      timeFormatter: constants.defaultTimeFormatter
    };
    const logInstance = Logfile.create(logpath, config);

    it('should correctly parse the first line', function(done){
      const correct = {
        text: `You must be pretty desperate if you're looking at the logs`,
        level: constants.levels.INFO,
        levelStr: 'info',
        datetime: 1489387840000,
        datetimeStr: '11:50:40'
      };
      done(isEqual(correct, logInstance.getAll()[0]) ? null : new Error('Did not match'));
    });

    it('should default level on unknown level', function(){
      assert.equal(logInstance.getAll()[4].level, constants.defaultLevel);
    });

    it('should default level string on unknown level', function(){
      assert.equal(logInstance.getAll()[4].levelStr, constants.defaultLevelStr);
    });
  });
});
