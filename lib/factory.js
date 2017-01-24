const Winston = require('winston')

const Formatter = require('./formatter')

module.exports = function (namespace, level, exitOnError) {
  return new Winston.Logger({
    exitOnError: exitOnError,
    transports: [
      new Winston.transports.Console({
        level: level,
        timestamp: function () {
          return new Date().toISOString()
        },
        formatter: Formatter.bind(null, namespace),
        handleExceptions: true,
        humanReadableUnhandledException: true
      })
    ]
  })
}
