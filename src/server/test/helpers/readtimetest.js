const fs = require('fs');
const path = require('path');

const startTime = Date.now() / 1000;

fs.readFile(path.join(__dirname, './test.log'), (err, data) => {
  console.log(data.toString().split('\n'));
  console.log((Date.now() / 1000) - startTime)
})
