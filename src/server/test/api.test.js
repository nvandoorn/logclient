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

// TODO move to helpers
// Abstract the route and API status
const apiCalls = route => ({
  get: params => wrapReq(axios.get(route, { params: params })),
  put: body => wrapReq(axios.put(route, body)),
  post: body => wrapReq(axios.post(route, body)),
  del: body => wrapReq(axios.delete(route, { data: body }))
})

// Each API call asserts success as returned from backend
const wrapReq = req => new Promise((resolve, reject) => {
  return req.then(resp => {
    assert(resp.data.success, `serer returned failure: ${resp.data.msg}`)
    resolve(resp.data)
  }).catch(err => reject(err))
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
      return Q.fcall(() => config.post(configBlob))
      .then(() => config.get())
      .then(resp => assert(subset(configBlob, resp.data, 'config receieved is not a superset')))
    })
  })

  describe('#directories', function () {
    const dirs = apiCalls(joinedRoutes.directories)
    it('should get a list of directories', function () {
      return dirs.get().then(resp => {
        expect(resp.data).toMatchSnapshot()
      })
    })
    it('should add a new directory', function () {
      const dirBlob = {
        path: './src/server/test/fixtures/somemorelogs',
        name: 'Test Fixture 3'
      }
      const find = k => k.path === dirBlob.path && k.name === dirBlob.name
      return Q.fcall(() => dirs.put(dirBlob))
      .then(() => dirs.get())
      .then(resp => assert(resp.data.some(find), `New entry not found for path ${dirs.path}`))
    })
    it('should modify a directory', function () {
      const newName = 'Some new name'
      return Q.fcall(dirs.get)
      .then(resp => new Promise((resolve, reject) => {
        dirs.get().then(resp => {
          resolve(resp.data.slice(-1)[0])
        })
      }))
      .then(oldEntry => dirs.post({ key: oldEntry.key, name: newName }))
      .then(() => dirs.get())
      .then(resp => assert(resp.data.some(k => k.name === newName), 'did not find new name'))
    })
    it('should delete a directory', function () {
      return Q.fcall(() => dirs.get())
      .then(resp => new Promise(resolve => {
        const delKey = resp.data.slice(-1)[0].key
        return dirs.del({ key: delKey }).then(resp => {
          resolve(delKey)
        })
      }))
      .then(delKey => new Promise(resolve => {
        dirs.get().then(resp => resolve({ resp: resp, delKey: delKey }))
      }))
      .then(blob => {
        assert(!blob.resp.data.some(k => k.key === blob.delKey),
                          `did not delete directory with key ${blob.delkey}`)
      })
    })
  })

  describe('#directory', function () {
    const dir = apiCalls(joinedRoutes.directory)
    const dirs = apiCalls(joinedRoutes.directories)
    let key = 0

    it('should get a list of files and match snapshot', function () {
      return dir.get().then(resp => expect(resp.data).toMatchSnapshot())
    })
    it('should scan a new directory and match snapshot', function () {
      return Q.fcall(dirs.get)
      .then(resp => {
        const newDirKey = resp.data.find(k => !k.active).key
        key = resp.data.find(k => k.active).key || key
        return dir.post({ key: newDirKey })
      })
      .then(() => dir.get())
      .then(resp => expect(resp.data).toMatchSnapshot())
    })
    it('should scan the previous directory and match snapshot', function () {
      return Q.fcall(() => dir.post({ key: key }))
      .then(() => dir.get())
      .then(resp => expect(resp.data).toMatchSnapshot())
    })
  })

  // TODO test /file endpoint
})
