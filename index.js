var _ = require('underscore')
var Request = require('request')
var Jsonic = require('jsonic')
var Patrun = require('patrun')

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

  var internals = {
    pr: Patrun()
  }

  // this reduction algorithm is only ran on startup
  var tempy = []
  for (var i = 0; i < options.services.length; i++) {
    var o = options.services[i]
    o.pattern = Jsonic(o.pattern)
    o.locValue = 0

    var j = _.pluck(tempy, 'pattern').indexOf(o.pattern)
    if (j === -1) {
      tempy.push(o)
      internals.pr.add(o.pattern, (tempy.length - 1))
      seneca.add(o.pattern, routeMessages)
    }
    else {
      // combine the locations array if the patterns match
      Array.prototype.push.apply(tempy[j].locations, o.locations)
    }
  }
  options.services = tempy

  seneca.on('act-in', function (actArgs) {
    var find = internals.pr.find(actArgs)
    if (find !== false) actArgs.route = find
  })

  // Capture all actions, try route them
  seneca.add({ role: 'router' }, routeMessages)

  function routeMessages (args, done) {
    var pattern = args
    var match = options.services[args.route]

    // right now we do a naive round robin with routing messages
    // we need to _actually_ load balance at some point
    // therefore we need to store the amt of currently processing messages
    // for every location and choose the one with lowest amt of currently
    // processing message
    var loc = match.locations[match.locValue]
    if (++match.locValue === match.locations.length) {
      match.locValue = 0
    }

    switch (loc.spec) {
      case 'http':
      case 'https':
        sendHttpAct(loc, pattern, done)
        break
      case 'tcp':
        sendTcpAct(loc, pattern, done)
        break
    }
  }

  function sendHttpAct (location, pattern, done) {
    delete pattern.transport$
    delete pattern.ungate$
    delete pattern.tx$
    delete pattern.meta$
    delete pattern.route
    var loc = location.spec + '://' + location.host + ':' + location.port + '/act'
    Request.post({ url: loc, json: pattern }, function (err, res, body) {
      done(err, body)
    })
  }

  function sendTcpAct (location, pattern, done) {
    // right now... do nothing
    done(null, pattern)
  }

  return {
    name: plugin
  }
}

// var config = {
//   services: [
//     {
//       pattern: ''||{}, // use your seneca pattern here
//       locations: [
//         {
//           host: '',
//           port: '',
//           spec: 'tcp' || 'http'
//         }
//       ]
//     }
//   ]
// }
