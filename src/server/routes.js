'use strict'

const express = require('express')
const apiRouter = express.Router()

const api = require('./controllers/api')()
const routes = require('../constants').routes

apiRouter.route(routes.config).get(api.readConfig).post(api.setConfig)
apiRouter.route(routes.directory).get(api.listActiveDir).post(api.setActiveDir)
apiRouter.route(routes.file).get(api.queryActiveFile)
apiRouter.route(routes.directories).get(api.listDirs).put(api.addDir).post(api.modifyDir).delete(api.deleteDir)

exports.api = apiRouter
exports.routes = routes
