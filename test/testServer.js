var Seneca = require('seneca')

var seneca = Seneca()

seneca.add({ a: 1 }, function (input, done) {
  console.log(input)
  done(null, { b: 1, port: process.argv[2] })
})

// eg. run with node ./test.js port
seneca.listen({ port: process.argv[2] })
