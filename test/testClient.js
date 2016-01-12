var Seneca = require('seneca')

var seneca = Seneca({ log: 'silent' })

// eg. run with node ./test.js port
seneca.client({ port: 10100, pin: {} })

setInterval(function () {
  seneca.act({ a: 1 }, console.log)
}, 10000)
