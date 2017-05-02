/* eslint-env jest */
'use strict'

const assert = require('chai').assert
const subset = require('json-subset')

const axios = require('axios')
const get = (route, params) => axios.get(route, { params: params })
const post = axios.post
const put = axios.put
const del = axios.delete

const constants = require('../../constants')
const getJoinedRoutes = require('../../helpers').getJoinedRoutes
const createServer = require('../../../scripts/server')

const TEST_PORT = 5000
const BASE_ROUTE = `http://localhost:${TEST_PORT}/api`
const joinedRoutes = getJoinedRoutes(BASE_ROUTE)

describe('REST API', function () {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 60 * 1000  // eslint-disable-line
  const server = createServer(TEST_PORT) // eslint-disable-line

  describe('#config()', function () {
    const config = {
      datetimePattern: constants.defaultDatetimePattern.toString().slice(1, -1),
      levelPattern: constants.defaultLevelPattern.toString().slice(1, -1),
      timeFormatter: constants.defaultTimeFormatter
    }
    it('should successfully set the config', function () {
      return post(joinedRoutes.config, config).then(resp => {
        assert(resp.data.success, 'should return success')
      })
    })
    it('should successfully get a superset of the same config', function () {
      return get(joinedRoutes.config).then(resp => {
        assert(resp.data.success, 'failed to get config')
        assert(subset(config, resp.data.data), 'config is not a superset')
      })
    })
  })

  describe('#directories', function () {
    it('should get a list of directories', function () {
      return get(joinedRoutes.directories).then(resp => {
        assert(resp.data.success, 'failed to get directory listing')
        expect(resp.data).toMatchSnapshot()
      })
    })
    it('should add a new directory', function () {
      return put(joinedRoutes.directories, {
        path: './src/server/test/fixtures/somemorelogs',
        name: 'Test Fixture 3'
      }).then(resp => {
        assert(resp.data.success, 'failed to add directory')
      })
    })
    it('should modify a directory', function () {

    })
    it('should delete a directory', function () {
      return get(joinedRoutes.directories).then(resp => {
        const delKey = resp.data.data.slice(-1)[0].key
        del(joinedRoutes.directories, { key: delKey }).then(resp => {
          assert(resp.data.success, 'failed to delete directory')
        })
      })
    })
  })
})
