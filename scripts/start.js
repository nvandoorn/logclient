'use strict';

const createServer = require("./server");
const build = require('./build');
const port = parseInt(process.env.PORT || 3000);

build();
createServer(port);
