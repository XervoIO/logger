const Code = require('code');
const Lab = require('lab');
const Proxyquire = require('proxyquire');
const Sinon = require('sinon');

var mock = { logger: true };
var factory = Sinon.stub().returns(mock);
const Logger = Proxyquire('..', {
  './lib/factory': factory
});

var lab = exports.lab = Lab.script();
var describe = lab.describe;
var it = lab.it;
var beforeEach = lab.beforeEach;
var afterEach = lab.afterEach;
var expect = Code.expect;

describe('Logger', function () {
  var fn;

  it('exports a function', function (done) {
    expect(Logger).to.be.a.function();
    done();
  });

  it('requires a namespace', function (done) {
    fn = function () {
      Logger();
    }

    expect(fn).to.throw('must provide namespace');
    done();
  });

  it('namespace must be string', function (done) {
    [void 0, null, [], {}, Function.prototype].forEach(function (el) {
      fn = function () {
        Logger(el);
      }
      expect(fn).to.throw('must provide namespace');
    });
    done();
  });

  it('returns a logger instance', function (done) {
    var instance = Logger('test');
    expect(factory.calledWith('test')).to.be.true();
    expect(instance).to.equal(mock);
    done();
  });

  describe('log level', function () {
    var level;

    beforeEach(function (done) {
      level = process.env.LOG_LEVEL; // eslint-disable-line no-process-env
      done();
    });

    afterEach(function (done) {
      process.env.LOG_LEVEL = level; // eslint-disable-line no-process-env
      done();
    });

    describe('when environment variable is not present', function () {
      beforeEach(function (done) {
        delete process.env.LOG_LEVEL; // eslint-disable-line no-process-env
        done();
      });

      it('defaults to "info"', function (done) {
        Logger('level');
        expect(factory.calledWith('level', 'info')).to.be.true();
        done();
      });
    });

    describe('when environment variable is present', function () {
      beforeEach(function (done) {
        process.env.LOG_LEVEL = 'test'; // eslint-disable-line no-process-env
        done();
      });

      it('uses it', function (done) {
        Logger('level');
        expect(factory.calledWith('level', 'test')).to.be.true();
        done();
      });
    });
  });
});
