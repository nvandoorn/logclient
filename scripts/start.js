'use strict'

const createServer = require('./server')
const fs = require('fs-extra')
const path = require('path')

const PORT = process.env.PORT || 3000
const INDEX_PATH = path.join(__dirname, '../build/index.html')

fs.stat(INDEX_PATH, (err, stats) => {
  if (!err && stats.isFile()) createServer(PORT)
  else {
    console.log(`Failed to serve ${INDEX_PATH}. Try running 'npm run build' and try again`)
    process.exit(1)
  }
})
