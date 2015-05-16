var pg = require('pg')
var ndjson = require('ndjson')
var queryStream = require('./')

pg.connect('postgres://localhost/postgres', function (err, client, done) {
  if (err) throw err

  queryStream(client.query('SELECT * FROM random'))
    .pipe(ndjson.serialize())
    .on('end', client.end.bind(client))
    .pipe(process.stdout)
})
