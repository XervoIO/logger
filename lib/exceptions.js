const Formatter = require('./formatter')
const Winston = require('winston')

const DEFAULTS = {
  exitOnError: false,
  formatter: Formatter('exception'),
  handleExceptions: true,
  humanReadableUnhandledException: true,
  level: 'error'
}

// create exception logger targeting stdio [and file]
const exceptions = (path) => {
  const transports = { console: DEFAULTS }
  if (path) transports.file = fileTransport(path)

  return Winston.loggers.get('exceptions', transports)
}

// get options for file logger
const fileTransport = (path) => Object.assign({}, DEFAULTS, {
  exitOnError: true,
  filename: path,
  json: false
})

module.exports = exceptions
