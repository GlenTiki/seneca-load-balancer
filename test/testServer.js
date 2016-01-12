var Seneca = require('seneca')

var seneca = Seneca()

seneca.use(require('..'), conf())

seneca.listen({port: 10100})

function conf () {
  return {
    services: [
      {
        pattern: { a: '1' },
        locations: [
          {
            host: 'localhost',
            port: '10201',
            spec: 'http'
          },
          {
            host: 'localhost',
            port: '10202',
            spec: 'http'
          }
        ]
      }
    ]
  }
}
