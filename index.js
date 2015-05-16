var through = require('through2')

module.exports = function (query) {
  var stream = through.obj()

  query.on('row', stream.push.bind(stream))
  query.on('error', stream.emit.bind('error'))

  query.on('end', function (result) {
    stream.emit('result', result)
    stream.end()
  })

  return stream
}
