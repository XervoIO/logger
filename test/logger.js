const Code = require('code')
const Tap = require('tap')
const Winston = require('winston')

const Logger = require('../lib/logger')

const { expect } = Code

const cleanup = (test) => {
  Winston.loggers.close('test')
  test.end()
}

Tap.test('returns a factory', (test) => {
  const factory = Logger('info')
  expect(factory).to.be.a.function()
  test.end()
})

Tap.test('requires a valid log level', (test) => {
  const valid = [ 'error', 'warn', 'info', 'verbose', 'debug', 'silly' ]
  const invalid = [ 'nope', 1 ]
  const wrapLogger = (level) => () => Logger(level)

  valid.map(wrapLogger).every((fn) => expect(fn).to.not.throw())
  invalid.map(wrapLogger)
    .every((fn) => expect(fn).to.throw(Error, 'must provide valid level'))
  test.end()
})

Tap.test('requires a valid namespace', (test) => {
  const valid = [ 'test' ]
  const invalid = [ 1, [], undefined, {} ]
  const wrapLogger = (namespace) => () => Logger('debug')(namespace)

  valid.map(wrapLogger).every((fn) => expect(fn).to.not.throw())
  invalid.map(wrapLogger)
    .every((fn) => expect(fn).to.throw(Error, 'must provide valid namespace'))
  test.end()
})

Tap.test('returns a Winston logger', (test) => {
  const logger = Logger('debug')('test')
  expect(logger).to.be.instanceOf(Winston.Logger)
  cleanup(test)
})

Tap.test('writes to the console', (test) => {
  const { transports } = Logger('debug')('test')
  expect(Object.keys(transports).length).to.equal(1)
  expect(transports.console).to.exist()
  cleanup(test)
})
