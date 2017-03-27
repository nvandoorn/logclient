'use strict';

const walk = require('walk');
const buildRes = require('../helpers/build-res');

/**
 * Walks a given direcory for log files (used in sidebar)
 *
 * @param direc: string
 *  Path to log direcory
 * @returns: {Promise}
 *  Resolves with a list of lognames
 */
module.exports = direc => {
  return new Promise((resolve, reject) => {
    let filenames = [];
    let walker = walk.walk(direc);
    walker.on('file', (root, fileStats, next) => {
      filenames.push(fileStats.name);
      next();
    });

    walker.on('end', () => {
      resolve(buildRes(true, `Successfully listed ${direc}`, filenames));
    });

    walker.on('error', err => {
      reject(buildRes(false, `Failed to list ${direc}: ${err.message}`));
    })
  });
};
