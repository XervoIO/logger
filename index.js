const Assert = require('assert');
const FS = require('fs');

const Winston = require('winston');

const Factory = require('./lib/factory');

const EXCEPTION_LOG = process.env.EXCEPTION_LOG; // eslint-disable-line no-process-env
var exitOnError = false;

function isString(str) {
  return typeof str === 'string';
}

if (isString(EXCEPTION_LOG)) {
  try {
    // ensure file is writeable
    /* eslint-disable no-sync */
    if (FS.accessSync) FS.accessSync(EXCEPTION_LOG, FS.F_OK | FS.W_OK);
    else FS.appendFileSync(EXCEPTION_LOG, '');
    /* eslint-enable no-sync */

    new Winston.Logger({
      transports: [
        new Winston.transports.File({
          level: 'error',
          filename: EXCEPTION_LOG,
          handleExceptions: true,
          humanReadableUnhandledException: true
        })
      ]
    });
  } catch (e) {
    exitOnError = true;
  }
}

module.exports = function (namespace) {
  var level;

  Assert(namespace && isString(namespace), 'must provide namespace');
  level = process.env.LOG_LEVEL || 'info'; // eslint-disable-line no-process-env

  return Factory(namespace, level, exitOnError);
};
