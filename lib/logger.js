const Assert = require('assert')
const Formatter = require('./formatter')
const Winston = require('winston')

// curried factory for logger instances
const factory = (level) => {
  Assert(isValidLevel(level), 'must provide valid level')

  return (namespace) => {
    Assert(isValidNamespace(namespace), 'must provide valid namespace')

    return logger(level, namespace)
  }
}

// predicate that checks level included Winston defaults
const isValidLevel = (level) => Object.keys(Winston.levels).includes(level)

// predicate that checks namespace is string
const isValidNamespace = (namespace) => typeof namespace === 'string'

// get a logger targeting stdio
const logger = (level, namespace) => {
  const options = {
    console: {
      level,
      colorize: true,
      formatter: Formatter(namespace)
    }
  }

  return Winston.loggers.get(namespace, options)
}

module.exports = factory
