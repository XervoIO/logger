const Assert = require('assert');
const FS = require('fs');

const Winston = require('winston');

const Factory = require('./lib/factory');

var exceptionLogger;

function isString(str) {
  return typeof str === 'string';
}

module.exports = function (namespace) {
  var level;

  Assert(namespace && isString(namespace), 'must provide namespace');
  level = process.env.LOG_LEVEL || 'info'; // eslint-disable-line no-process-env

  return Factory(namespace, level, !exceptionLogger);
};

module.exports.writeExceptions = function (path, exitOnError) {
  Assert(path && isString(path), 'must provide a file path');

  // TODO use FS.accessSync(path, FS.F_OK | FS.W_OK), node > 4.0
  FS.appendFileSync(path, ''); // eslint-disable-line no-sync

  exceptionLogger = new Winston.Logger({
    transports: [
      new Winston.transports.File({
        exitOnError: exitOnError,
        filename: path,
        handleExceptions: true,
        humanReadableUnhandledException: true
      })
    ]
  });
};
