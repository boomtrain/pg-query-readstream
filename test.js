var test = require('tape')
var pg = require('pg')
var concat = require('concat-stream')
var queryStream = require('./')

test('setup', function (t) {
  pg.connect('postgres://postgres:@localhost/postgres', function (err, client, done) {
    t.error(err, 'no error')

    var query = 'DROP TABLE IF EXISTS test_random; CREATE TABLE test_random as SELECT generate_series(1,100) AS id, md5(random()::text) AS descr;'
    client.query(query, function (err, result) {
      t.error(err, 'no error')
      client.end()
      t.end()
    })
  })
})

test('wraps postgres query in through-stream', function (t) {
  t.plan(4)

  pg.connect('postgres://postgres:@localhost/postgres', function (err, client, done) {
    t.error(err, 'no error')

    queryStream(client.query('SELECT * FROM test_random LIMIT 100'))
      .pipe(concat(function (data) {
        t.equal(data.length, 100, 'emits amount requested')
        t.ok(data[0].id, 'emits proper data from db')
        t.ok(data[0].descr, 'emits proper data from db')
      }))
      .on('finish', client.end.bind(client))
  })
})

test('emits errors on invalid query', function (t) {
  t.plan(2)

  pg.connect('postgres://postgres:@localhost/postgres', function (err, client, done) {
    t.error(err, 'no error')

    queryStream(client.query('SELECT test_random LIMIT 100'))
      .on('error', function (error) {
        t.ok(error, 'emits error on bad request')
        client.end()
      })
  })
})
