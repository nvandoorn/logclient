/* eslint-env jest */
'use strict'

const assert = require('chai').assert
const subset = require('json-subset')
const Q = require('q')

const axios = require('axios')

const constants = require('../../constants')
const getJoinedRoutes = require('../../helpers').getJoinedRoutes
const createServer = require('../../../scripts/server')

const TEST_PORT = 5000
const BASE_ROUTE = `http://localhost:${TEST_PORT}/api`
const joinedRoutes = getJoinedRoutes(BASE_ROUTE)

const apiCalls = route => ({
  get: params => axios.get(route, { params: params }),
  put: body => axios.put(route, body),
  post: body => axios.post(route, body),
  del: body => axios.delete(route, { data: body })
})

describe('REST API', function () {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 60 * 1000  // eslint-disable-line
  const server = createServer(TEST_PORT) // eslint-disable-line

  describe('#config()', function () {
    const config = apiCalls(joinedRoutes.config)
    const configBlob = {
      datetimePattern: constants.defaultDatetimePattern.toString().slice(1, -1),
      levelPattern: constants.defaultLevelPattern.toString().slice(1, -1),
      timeFormatter: constants.defaultTimeFormatter
    }
    it('should successfully set the config', function () {
      return config.post(configBlob).then(resp => {
        assert(resp.data.success, 'should return success')
      })
    })
    it('should successfully get a superset of the same config', function () {
      return config.get().then(resp => {
        assert(resp.data.success, 'failed to get config')
        assert(subset(configBlob, resp.data.data), 'config is not a superset')
      })
    })
  })

  describe('#directories', function () {
    const dir = apiCalls(joinedRoutes.directories)
    it('should get a list of directories', function () {
      return dir.get().then(resp => {
        assert(resp.data.success, 'failed to get directory listing')
        expect(resp.data).toMatchSnapshot()
      })
    })
    it('should add a new directory', function () {
      const dirBlob = {
        path: './src/server/test/fixtures/somemorelogs',
        name: 'Test Fixture 3'
      }
      const find = k => k.path === dirBlob.path && k.name === dirBlob.name
      return Q.fcall(() => dir.put(dirBlob))
      .then(resp => assert(resp.data.success, 'failed to add directory'))
      .then(dir.get)
      .then(resp => assert(resp.data.data.some(find), `New entry not found for path ${dir.path}`))
    })
    it('should modify a directory', function () {
      const newName = 'Some new name'
      return Q.fcall(() => dir.get())
      .then(resp => new Promise((resolve, reject) => {
        resolve(resp.data.data.slice(-1)[0])
      }))
      .then(oldEntry => dir.post({ key: oldEntry.key, name: newName }))
      .then(resp => assert(resp.data.success, 'failed to modify directory'))
      .then(dir.get)
      .then(resp => assert(resp.data.data.some(k => k.name === newName), 'did not find new name'))
    })
    it('should delete a directory', function () {
      return Q.fcall(dir.get)
      .then(resp => new Promise(resolve => {
        assert(resp.data.success, 'failed to list directory')
        const delKey = resp.data.data.slice(-1)[0].key
        return dir.del({ key: delKey }).then(resp => {
          assert(resp.data.success, 'failed to delete directory')
          resolve(delKey)
        })
      }))
      .then(delKey => new Promise(resolve => {
        dir.get().then(resp => resolve({ resp: resp, delKey: delKey }))
      }))
      .then(blob => {
        assert(blob.resp.data.success, 'failed to list directory')
        assert(!blob.resp.data.data.some(k => k.key === blob.delKey),
                          `Did not delete directory with key ${blob.delkey}`)
      })
    })
  })
})
