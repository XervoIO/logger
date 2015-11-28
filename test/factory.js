const Code = require('code');
const Lab = require('lab');
const StdMocks = require('std-mocks');

const Factory = require('../lib/factory');

var lab = exports.lab = Lab.script();
var describe = lab.describe;
var it = lab.it;
var beforeEach = lab.beforeEach;
var expect = Code.expect;

describe('Factory', function () {
  var logger;

  beforeEach(function (done) {
    logger = Factory('test', 'debug');
    done();
  });

  it('exports a function', function (done) {
    expect(Factory).to.be.a.function();
    done();
  });

  it('returns a logger instance', function (done) {
    ['error', 'warn', 'info', 'debug'].forEach(function (level) {
      expect(logger[level]).to.be.a.function();
    });
    done();
  });

  describe('instance methods', function () {
    var stdio;

    describe('info', function () {
      beforeEach(function (done) {
        StdMocks.use();
        logger.info('message');
        StdMocks.restore();
        stdio = StdMocks.flush();
        done();
      });

      it('prints to stdout', function (done) {
        expect(stdio.stdout.pop()).to.contain('INFO test message');
        done();
      });
    });

    describe('warn', function () {
      beforeEach(function (done) {
        StdMocks.use();
        logger.warn('message');
        StdMocks.restore();
        stdio = StdMocks.flush();
        done();
      });

      it('prints to stdout', function (done) {
        expect(stdio.stdout.pop()).to.contain('WARN test message');
        done();
      });
    });

    describe('error', function () {
      beforeEach(function (done) {
        StdMocks.use();
        logger.error('message');
        StdMocks.restore();
        stdio = StdMocks.flush();
        done();
      });

      it('prints to stderr', function (done) {
        expect(stdio.stderr.pop()).to.contain('ERROR test message');
        done();
      });
    });

    describe('debug', function () {
      beforeEach(function (done) {
        StdMocks.use();
        logger.debug('message');
        StdMocks.restore();
        stdio = StdMocks.flush();
        done();
      });

      it('prints to stderr', function (done) {
        expect(stdio.stderr.pop()).to.contain('DEBUG test message');
        done();
      });
    });
  });
});
