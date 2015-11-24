const Winston = require('winston');

const Formatter = require('./lib/formatter');

const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

module.exports = function (namespace) {
  return new Winston.Logger({
    transports: [
      new Winston.transports.Console({
        level: LOG_LEVEL,
        timestamp: function () {
          return new Date().toISOString();
        },
        formatter: Formatter.bind(null, namespace),
        handleExceptions: true,
        humanReadableUnhandledException: true
      })
    ]
  });
};
