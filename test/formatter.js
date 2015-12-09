const Code = require('code');
const Lab = require('lab');
const Sinon = require('sinon');

const Formatter = require('../lib/formatter');

var lab = exports.lab = Lab.script();
var describe = lab.describe;
var it = lab.it;
var beforeEach = lab.beforeEach;
var expect = Code.expect;

describe('Formatter', function () {
  var namespace, timestamp, data

  beforeEach(function (done) {
    namespace = 'test';
    timestamp = new Date().toISOString()
    data = {
      timestamp: Sinon.stub().returns(timestamp),
      level: 'info',
      message: 'example message',
      meta: { test: true }
    };

    done();
  });

  it('exports a function', function (done) {
    expect(Formatter).to.be.a.function();
    done();
  });

  it('returns a string', function (done) {
    var out = Formatter(namespace, data);
    expect(out).to.be.a.string();
    done();
  });

  describe('format', function () {
    var out

    beforeEach(function (done) {
      out = Formatter(namespace, data);
      done();
    });

    it('contains the timestamp', function (done) {
      expect(out.split(' ')[0]).to.equal(timestamp);
      done();
    });

    it('contains the level, uppercased', function (done) {
      expect(out.split(' ')[1]).to.equal('INFO');
      done();
    });

    it('contains the namespace', function (done) {
      expect(out.split(' ')[2]).to.equal('test');
      done();
    });

    it('contains the message', function (done) {
      expect(out).to.contain('example message');
      done();
    });

    describe('when called without a message', function () {
      beforeEach(function (done) {
        delete data.message;
        done()
      });

      it('returns a string', function (done) {
        out = Formatter(namespace, data);
        expect(out).to.be.string();
        done();
      });
    });

    it('contains the stringified metadata', function (done) {
      expect(out).to.contain('{"test":true}');
      done();
    });

    describe('when called without metadata', function () {
      beforeEach(function (done) {
        delete data.meta;
        done()
      });

      it('returns a string', function (done) {
        out = Formatter(namespace, data);
        expect(out).to.be.string();
        done();
      });
    });
  });
});
