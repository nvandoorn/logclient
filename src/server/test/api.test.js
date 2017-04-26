/* eslint-env jest */
'use strict'

const assert = require('chai').assert
const path = require('path')

const axios = require('axios')
const subset = require('json-subset')

const get = (route, params) => axios.get(route, { params: params })
const post = axios.post

const constants = require('../../constants')
const ROUTES = require('../routes').routes
const createServer = require('../../../scripts/server')

const LOGFILE_PATH = path.join(__dirname, './fixtures')
const TEST_PORT = 5000
const BASE_ROUTE = `http://localhost:${TEST_PORT}/api`
const CONFIG_ROUTE = BASE_ROUTE + ROUTES.CONFIG

describe('REST API', function () {
  const server = createServer(TEST_PORT); // eslint-disable-line
  describe('#config()', function () {
    const config = {
      datetimePattern: constants.defaultDatetimePattern.toString().slice(1, -1),
      levelPattern: constants.defaultLevelPattern.toString().slice(1, -1),
      timeFormatter: constants.defaultTimeFormatter,
      folders: [{
        name: 'Test Fixture',
        directory: LOGFILE_PATH
      }]
    }
    it('should successfully set the config', function () {
      console.log(expect(post(CONFIG_ROUTE, config)))
    })
    it('should successfully get a superset of the same config', function () {
      return get(CONFIG_ROUTE).then(body => {
        assert(body.data.success, 'failed to get config')
        assert(subset(config, body.data), 'configs are not equal')
      })
    })
  })
})
