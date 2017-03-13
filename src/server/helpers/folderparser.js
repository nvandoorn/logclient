const walk = require('walk');

/**
 * Walks a given directory for log files (used in sidebar)
 *
 * @param logDir: string
 *  Path to log direcory
 * @returns: {Promise}
 *  Resolves with a list of lognames
 */
exports.getLogFileNames = (logDir) => {
  return new Promise((resolve, reject) => {
    let logFileNames = [];
    let walker = walk.walk(logDir);
    walker.on('file', (root, fileStats, next) => {
      logFileNames.push(fileStats.name);
      next();
    });

    walker.on('end', () => {
      resolve(logFileNames);
    });
  });
};