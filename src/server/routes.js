'use strict'

const express = require('express')
const apiRouter = express.Router()

const api = require('./controllers/api')()

apiRouter.route('/config').get(api.readConfig).post(api.setConfig)
apiRouter.route('/directory').get(api.listActiveDir).post(api.setActiveDir)
apiRouter.route('/file').get(api.queryActiveFile)
apiRouter.route('/directories').get(api.listDirs).put(api.addDir).post(api.modifyDir)

module.exports.api = apiRouter
