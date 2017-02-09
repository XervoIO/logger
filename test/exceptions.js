const Code = require('code')
const Tap = require('tap')
const Winston = require('winston')

const Exceptions = require('../lib/exceptions')

const { expect } = Code

const cleanup = (test) => {
  Winston.loggers.close('exceptions')
  test.end()
}

Tap.test('returns a Winston logger', (test) => {
  const logger = Exceptions()
  expect(logger).to.be.instanceOf(Winston.Logger)
  cleanup(test)
})

Tap.test('creates an exception logger', (test) => {
  expect(Winston.loggers.has('exceptions')).to.be.false()
  Exceptions()
  expect(Winston.loggers.has('exceptions')).to.be.true()
  cleanup(test)
})

Tap.test('writes to the console', (test) => {
  const { transports } = Exceptions()
  expect(Object.keys(transports).length).to.equal(1)
  expect(transports.console).to.exist()
  cleanup(test)
})

Tap.test('writes to file if passed', (test) => {
  const { transports } = Exceptions('./path/to/file.log')
  expect(Object.keys(transports).length).to.equal(2)
  expect(transports.console).to.exist()
  expect(transports.file).to.exist()
  expect(transports.file.dirname).to.equal('./path/to')
  expect(transports.file.filename).to.equal('file.log')
  cleanup(test)
})
