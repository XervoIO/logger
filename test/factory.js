const Code = require('code');
const Lab = require('lab');
const Sinon = require('sinon');
const StdMocks = require('std-mocks');

const Factory = require('../lib/factory');

var lab = exports.lab = Lab.script();
var describe = lab.describe;
var it = lab.it;
var afterEach = lab.afterEach;
var beforeEach = lab.beforeEach;
var expect = Code.expect;

describe('Factory', function () {
  var logger, stdio;

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

    describe('exceptions', function () {
      beforeEach(function (done) {
        Sinon.stub(process, 'exit');

        StdMocks.use();
        process.emit('uncaughtException', new Error('uncaught'));
        StdMocks.restore();
        stdio = StdMocks.flush();

        done();
      });

      afterEach(function (done) {
        process.exit.restore();
        done();
      });

      it('prints to stderr', function (done) {
        var log = stdio.stderr.pop();
        expect(log).to.contain('uncaughtException');
        expect(log).to.contain('Error: uncaught');
        done();
      });
    });
  });

  describe('process exit', function () {
    beforeEach(function (done) {
      Sinon.stub(process, 'exit');
      done();
    });

    afterEach(function (done) {
      process.exit.restore();
      done();
    });

    describe('when created without the noExit param', function () {
      beforeEach(function (done) {
        StdMocks.use();
        process.emit('uncaughtException', new Error('uncaught'));
        StdMocks.restore();

        done();
      });

      it('exits the process', function (done) {
        expect(process.exit.calledWith(1)).to.be.true();
        done();
      });
    });

    describe('when created with the noExit param', function () {
      beforeEach(function (done) {
        process.removeAllListeners('uncaughtException');
        logger = Factory('test', 'debug', false);

        StdMocks.use();
        process.emit('uncaughtException', new Error('other'));
        StdMocks.restore();

        done();
      });

      it('does not exit the process', function (done) {
        expect(process.exit.called).to.be.false();
        done();
      });
    });
  });
});
