const Code = require('code')
const Lab = require('lab')
const Sinon = require('sinon')
const StdMocks = require('std-mocks')

const Factory = require('../lib/factory')

var lab = exports.lab = Lab.script()
var describe = lab.describe
var it = lab.it
var afterEach = lab.afterEach
var beforeEach = lab.beforeEach
var expect = Code.expect

const ENV = Object.assign({}, process.env)

describe('Factory', function () {
  var logger, stdio

  beforeEach(function (done) {
    logger = Factory('test', 'debug')
    done()
  })

  afterEach(function (done) {
    process.env = Object.assign({}, ENV)
    done()
  })

  it('exports a function', function (done) {
    expect(Factory).to.be.a.function()
    done()
  })

  it('returns a logger instance', function (done) {
    ['error', 'warn', 'info', 'debug'].forEach(function (level) {
      expect(logger[level]).to.be.a.function()
    })
    done()
  })

  describe('instance methods', function () {
    describe('info', function () {
      beforeEach(function (done) {
        StdMocks.use()
        logger.info('message')
        StdMocks.restore()
        stdio = StdMocks.flush()
        done()
      })

      it('prints to stdout', function (done) {
        expect(stdio.stdout.pop()).to.contain('INFO test message')
        done()
      })
    })

    describe('warn', function () {
      beforeEach(function (done) {
        StdMocks.use()
        logger.warn('message')
        StdMocks.restore()
        stdio = StdMocks.flush()
        done()
      })

      it('prints to stdout', function (done) {
        expect(stdio.stdout.pop()).to.contain('WARN test message')
        done()
      })
    })

    describe('error', function () {
      beforeEach(function (done) {
        StdMocks.use()
        logger.error('message')
        StdMocks.restore()
        stdio = StdMocks.flush()
        done()
      })

      it('prints to stderr', function (done) {
        expect(stdio.stderr.pop()).to.contain('ERROR test message')
        done()
      })
    })

    describe('debug', function () {
      beforeEach(function (done) {
        StdMocks.use()
        logger.debug('message')
        StdMocks.restore()
        stdio = StdMocks.flush()
        done()
      })

      it('prints to stderr', function (done) {
        expect(stdio.stderr.pop()).to.contain('DEBUG test message')
        done()
      })
    })

    describe('exceptions', function () {
      afterEach(function (done) {
        process.exit.restore()
        done()
      })

      describe('when in production environment', function () {
        beforeEach(function (done) {
          process.env.NODE_ENV = 'production'

          Sinon.stub(process, 'exit')

          StdMocks.use()
          process.emit('uncaughtException', new Error('uncaught'))
          StdMocks.restore()
          stdio = StdMocks.flush()

          done()
        })

        it('prints to stderr', function (done) {
          var log = stdio.stderr.pop()
          expect(log).to.contain('uncaughtException')
          expect(log).to.not.match(/logger\/test\/factory.js:(?:\d+):(?:\d+)\n/)
          done()
        })
      })

      describe('when not in production environment', function () {
        beforeEach(function (done) {
          Sinon.stub(process, 'exit')

          StdMocks.use()
          process.emit('uncaughtException', new Error('uncaught'))
          StdMocks.restore()
          stdio = StdMocks.flush()

          done()
        })

        it('prints to stderr with stack trace', function (done) {
          var log = stdio.stderr.pop()
          expect(log).to.contain('uncaughtException')
          expect(log).to.match(/logger\/test\/factory.js:(?:\d+):(?:\d+)\n/)
          done()
        })
      })
    })
  })

  describe('process exit', function () {
    beforeEach(function (done) {
      Sinon.stub(process, 'exit')
      done()
    })

    afterEach(function (done) {
      process.exit.restore()
      done()
    })

    describe('when created without the noExit param', function () {
      beforeEach(function (done) {
        StdMocks.use()
        process.emit('uncaughtException', new Error('uncaught'))
        StdMocks.restore()

        done()
      })

      it('exits the process', function (done) {
        expect(process.exit.calledWith(1)).to.be.true()
        done()
      })
    })

    describe('when created with the noExit param', function () {
      beforeEach(function (done) {
        process.removeAllListeners('uncaughtException')
        logger = Factory('test', 'debug', false)

        StdMocks.use()
        process.emit('uncaughtException', new Error('other'))
        StdMocks.restore()

        done()
      })

      it('does not exit the process', function (done) {
        expect(process.exit.called).to.be.false()
        done()
      })
    })
  })
})
