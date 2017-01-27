const Exceptions = require('./lib/exceptions')
const FS = require('fs')
const Logger = require('./lib/logger')

const EXCEPTION_LOG = process.env.EXCEPTION_LOG

// ensure file exists and is writeable
const isWriteable = (path) => {
  try {
    FS.accessSync(path, FS.F_OK | FS.W_OK)
    return true
  } catch (err) {
    return false
  }
}

const file = isWriteable(EXCEPTION_LOG) ? EXCEPTION_LOG : null
Exceptions(file)

module.exports = Logger(process.env.LOG_LEVEL || 'info')
