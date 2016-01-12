var Lab = require('lab')
var Code = require('code')
var Seneca = require('seneca')

var lab = exports.lab = Lab.script()

var describe = lab.describe
var it = lab.it
var expect = Code.expect

var Balancer = require('..')

describe('stub', function () {
  it('passed', function (done) {
    var seneca = Seneca()
    seneca
      .use(Balancer)
      .client()
    expect(true).to.equal(true)
    done()
  })
})
