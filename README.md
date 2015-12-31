# pg-query-readstream

Expose pg query as a readable stream

[![build status](http://img.shields.io/travis/boomtrain/pg-query-readstream.svg?style=flat)](http://travis-ci.org/boomtrain/pg-query-readstream)

## Example

``` js
var pg = require('pg')
var ndjson = require('ndjson')
var queryStream = require('pg-query-readstream')

pg.connect('postgres://localhost/postgres', function (err, client, done) {
  queryStream(client.query('SELECT * FROM random'))
    .pipe(ndjson.serialize())
    .on('end', client.end.bind(client))
    .pipe(process.stdout)
})
```

## Usage

### `queryStream(client.query('SELECT * from random'))`

`queryStream` will wrap a `client.query` call in a readable stream.

## Events

- `result` – result stats from the pg query

## Note

This module was created to expose postgres queries in a simple readable stream without buffering
results. The existing [pg-query-stream](https://www.npmjs.com/package/pg-query-stream) module
works great with postgres, however [Redshift](http://aws.amazon.com/redshift/) does not support
this same cursor format. [pg-cursor](https://www.npmjs.com/package/pg-cursor) ends up
[buffering the entire result set](http://git.io/vTfEY) in memory.
[Redshift](http://aws.amazon.com/redshift/) also
[advises against](http://docs.aws.amazon.com/redshift/latest/dg/declare.html#declare-performance)
using their form of cursors when dealing with large results.

This module currently does not deal with backpressure.
Rows are emitted as fast as they are received.

## License

MIT
