/* eslint-env jest */
'use strict'

const assert = require('chai').assert
const axios = require('axios')
const subset = require('json-subset')

const constants = require('../../constants')
const ROUTES = require('../routes').routes
const createServer = require('../../../scripts/server')

const TEST_PORT = 5000
const BASE_ROUTE = `http://localhost:${TEST_PORT}/api`
const CONFIG_ROUTE = BASE_ROUTE + ROUTES.CONFIG

describe('REST API', function () {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 20 * 1000  // eslint-disable-line
  const server = createServer(TEST_PORT) // eslint-disable-line
  describe('#config()', function () {
    const config = {
      datetimePattern: constants.defaultDatetimePattern.toString().slice(1, -1),
      levelPattern: constants.defaultLevelPattern.toString().slice(1, -1),
      timeFormatter: constants.defaultTimeFormatter
    }
    test('should successfully set the config', function () {
      return axios.post(CONFIG_ROUTE, config).then(resp => {
        assert(resp.data.success, 'should return success')
      })
    })
    test('should successfully get a superset of the same config', function () {
      return axios.get(CONFIG_ROUTE).then(body => {
        assert(body.data.success, 'failed to get config')
        assert(subset(config, body.data.data), 'config is not a superset')
      })
    }, 30 * 1000)
  })
})
