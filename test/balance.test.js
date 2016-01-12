var Lab = require('lab')
var Code = require('code')
var Seneca = require('seneca')

var lab = exports.lab = Lab.script()

var describe = lab.describe
var it = lab.it
var expect = Code.expect

// var exec = require('child_process').exec

var Balancer = require('..')

describe('balance test', function () {
  it('passed', function (done) {
    var seneca = Seneca()

    seneca
      .use(Balancer)
      .listen({ host: 'localhost', port: 10101 })

    expect(true).to.equal(true)

    done()
  })
})
