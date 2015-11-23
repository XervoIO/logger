const Winston = require('winston');

const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

function getFormatter(namespace) {
  return function (options) {
    var out = [
      options.timestamp(),
      options.level.toUpperCase(),
      namespace
    ];

    if (options.message) out.push(options.message);
    if (options.meta && Object.keys(options.meta).length) {
      out.push(JSON.stringify(options.meta));
    }

    return out.join(' ');
  }
}

module.exports = function (namespace) {
  return new Winston.Logger({
    transports: [
      new Winston.transports.Console({
        level: LOG_LEVEL,
        timestamp: function () {
          return new Date().toISOString();
        },
        formatter: getFormatter(namespace),
        handleExceptions: true,
        humanReadableUnhandledException: true
      })
    ]
  });
};
