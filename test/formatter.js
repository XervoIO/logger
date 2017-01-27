const Code = require('code')
const OS = require('os')
const Tap = require('tap')

const Formatter = require('../lib/formatter')('test')

const { expect } = Code

const data = (props) => Object.assign({
  level: 'info'
}, props)

const isISOString = (str) => new Date(str).toISOString() === str

Tap.test('includes datetime', (test) => {
  const timestamp = Formatter(data()).split(' ')[0]
  expect(isISOString(timestamp)).to.be.a.be.true()
  test.end()
})

Tap.test('includes uppercased level', (test) => {
  const namespace = Formatter(data()).split(' ')[1]
  expect(namespace).to.be.equal('INFO')
  test.end()
})

Tap.test('includes namespace', (test) => {
  const namespace = Formatter(data()).split(' ')[2]
  expect(namespace).to.be.equal('test')
  test.end()
})

Tap.test('includes message (if provided)', (test) => {
  const message = Formatter(data({ message: 'hello' })).split(' ')[3]
  expect(message).to.be.equal('hello')
  test.end()
})

Tap.test('includes metadata (if provided)', (test) => {
  const meta = { obj: true, nest: [ 1, 2, { 3: true } ] }
  const out = Formatter(data({ meta })).split(' ')[3]
  expect(out).to.be.equal('{"obj":true,"nest":[1,2,{"3":true}]}')
  test.end()
})

Tap.test('includes stack if exception', (test) => {
  const meta = { stack: [ 'one', 'two' ] }
  const out = Formatter(data({ message: 'uncaughtException: test', meta }))
  expect(out).to.be.contain(`${OS.EOL}one${OS.EOL}two`)
  test.end()
})
