const Assert = require('assert');

const Logger = require('./lib/logger');

function isString(str) {
  return typeof str === 'string';
}

module.exports = function (namespace) {
  var level;

  Assert(namespace && isString(namespace), 'must provide namespace');
  level = process.env.LOG_LEVEL || 'info' ; // eslint-disable-line no-process-env

  return Logger(namespace, level);
};
