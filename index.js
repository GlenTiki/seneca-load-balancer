var _ = require('underscore')
var Request = require('request')

module.exports = function (options) {
  var seneca = this

  var plugin = 'load-balancer'

  options = seneca.util.deepextend({
    pin: {},
    services: []
  }, options)

  // verify that every service has a 'pattern' property
  if (options.services.length !== _.pluck(options.services, 'pattern').length) {
    throw Error('Every object in the services array must have a pattern property')
  }

  // verify that every service has a 'locations' property
  if (options.services.length !== _.pluck(options.services, 'locations').length) {
    throw Error('Every object in the services array must have a locations property')
  }

  seneca.add({ role: plugin, ping: true }, ping)

  // Capture all actions, try route them
  seneca.add({}, captureAllMessages)

  function ping (args, done) {
    done(null, { now: Date.now() })
  }

  function captureAllMessages (args, done) {
    var pat = args.meta$.pattern

    var i = bestMatch(pat, _.pluck(options.services, 'pattern'))

    var match = options.services[i]

    if (!match.locVal) {
      match.locVal = 0
    }
    var location = bestMatch.locations[match.locVal]
    if (++match.locVal === match.locations.length) {
      match.locVal = 0
    }

    Request.post(location, function (err, res, body) {
      if (err) {
        return done(err)
      }
      done(null, body)
    })
  }

  function bestMatch (pattern, Comparisons) {
    var index = 0
    // the index of the best match to use from the comparisons array
    return index
  }

  return {
    name: plugin
  }
}

// var config = {
//   services: [
//     {
//       pattern: ''||{},
//       locations: [
//         'type@host:port',
//         {
//           host: '',
//           port: '',
//           type: 'tcp' || 'http'
//         }
//       ]
//     }
//   ]
// }
