const FS = require('fs')
const Path = require('path')
const OS = require('os')

const Code = require('code')
const Clone = require('lodash.clone')
const Lab = require('lab')
const Proxyquire = require('proxyquire')
const Sinon = require('sinon')
const StdMocks = require('std-mocks')

var mock = { logger: true }
var factory = Sinon.stub().returns(mock)
const Logger = Proxyquire('..', {
  './lib/factory': factory
})

var lab = exports.lab = Lab.script()
var describe = lab.describe
var it = lab.it
var beforeEach = lab.beforeEach
var afterEach = lab.afterEach
var expect = Code.expect

const ENV = Clone(process.env, true) // eslint-disable-line no-process-env

describe('Logger', function () {
  var fn

  afterEach(function (done) {
    factory.reset()
    process.env = Clone(ENV, true) // eslint-disable-line no-process-env
    done()
  })

  it('exports a function', function (done) {
    expect(Logger).to.be.a.function()
    done()
  })

  it('requires a namespace', function (done) {
    fn = function () {
      Logger()
    }

    expect(fn).to.throw('must provide namespace')
    done()
  })

  it('namespace must be string', function (done) {
    [void 0, null, [], {}, Function.prototype].forEach(function (el) {
      fn = function () {
        Logger(el)
      }
      expect(fn).to.throw('must provide namespace')
    })
    done()
  })

  it('returns a logger instance', function (done) {
    var instance = Logger('test')
    expect(factory.calledWith('test')).to.be.true()
    expect(instance).to.equal(mock)
    done()
  })

  describe('log level', function () {
    describe('when environment variable is not present', function () {
      beforeEach(function (done) {
        delete process.env.LOG_LEVEL // eslint-disable-line no-process-env
        done()
      })

      it('defaults to "info"', function (done) {
        Logger('namespace')
        expect(factory.calledWith('namespace', 'info')).to.be.true()
        done()
      })
    })

    describe('when environment variable is present', function () {
      beforeEach(function (done) {
        process.env.LOG_LEVEL = 'test' // eslint-disable-line no-process-env
        done()
      })

      it('uses it', function (done) {
        Logger('namespace')
        expect(factory.calledWith('namespace', 'test')).to.be.true()
        done()
      })
    })
  })

  describe('writeExceptions', function () {
    it('requires a path', function (done) {
      fn = function () {
        Logger.writeExceptions()
      }

      expect(fn).to.throw('must provide a file path')
      done()
    })

    it('path must be string', function (done) {
      [void 0, null, [], {}, Function.prototype].forEach(function (el) {
        fn = function () {
          Logger.writeExceptions(el)
        }
        expect(fn).to.throw('must provide a file path')
      })
      done()
    })

    describe('when no exception log is not set', function () {
      it('creates loggers that exit on exceptions', function (done) {
        Logger('namespace')
        expect(factory.lastCall.args.pop()).to.be.true()
        done()
      })
    })

    describe('when exception log is set', function () {
      var logPath

      beforeEach(function (done) {
        logPath = Path.join(OS.tmpdir(), 'exception.log')
        process.env.EXCEPTION_LOG = logPath // eslint-disable-line no-process-env, max-len
        Sinon.stub(process, 'exit')

        FS.writeFile(logPath, null, function (err) {
          if (err) return done(err)

          FS.access(logPath, FS.OK | FS.W_OK, function (err) {
            if (err) return done(err)

            Logger.writeExceptions(logPath)

            StdMocks.use()
            process.emit('uncaughtException', new Error('uncaught'))
            StdMocks.restore()
            StdMocks.flush()

            done()
          })
        })
      })

      afterEach(function (done) {
        process.exit.restore()
        FS.unlink(logPath, done)
      })

      it('creates loggers that do not exit on exceptions', function (done) {
        Logger('namespace')
        expect(factory.lastCall.args.pop()).to.be.false()
        done()
      })

      describe('when log is writeable', function () {
        it('writes exceptions to file', function (done) {
          FS.readFile(logPath, 'utf8', function (err, log) {
            if (err) return done(err)

            expect(log).to.contain('uncaughtException')
            expect(log).to.contain('Error: uncaught')
            done()
          })
        })
      })

      describe('when log is not writeable', function () {
        beforeEach(function (done) {
          Sinon.stub(FS, 'appendFileSync').throws()
          done()
        })

        afterEach(function (done) {
          FS.appendFileSync.restore() // eslint-disable-line no-sync
          done()
        })

        it('throws an exception', function (done) {
          fn = function () {
            Logger.writeExceptions(logPath)
          }

          expect(fn).to.throw()
          done()
        })
      })
    })
  })
})
