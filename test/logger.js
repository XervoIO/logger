const Code = require('code');
const Lab = require('lab');

const Logger = require('..');

var lab = exports.lab = Lab.script();
var describe = lab.describe;
var it = lab.it;
var expect = Code.expect;

describe('Logger', function () {
  it('exports a function', function (done) {
    expect(Logger).to.be.a.function();
    done();
  });
});
