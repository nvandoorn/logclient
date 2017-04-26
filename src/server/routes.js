'use strict'

const express = require('express')
const apiRouter = express.Router()

const api = require('./controllers/api')()

const ROUTES = {
  CONFIG: '/config',
  DIRECTORY: '/directory',
  FILE: '/file',
  DIRECTORIES: '/directories'
}

apiRouter.route(ROUTES.CONFIG).get(api.readConfig).post(api.setConfig)
apiRouter.route(ROUTES.DIRECTORY).get(api.listActiveDir).post(api.setActiveDir)
apiRouter.route(ROUTES.FILE).get(api.queryActiveFile)
apiRouter.route(ROUTES.DIRECTORIES).get(api.listDirs).put(api.addDir).post(api.modifyDir).delete(api.deleteDir)

module.exports.api = apiRouter
exports.routes = ROUTES
