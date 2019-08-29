// user `through2` module to convert chunk data

var through2 = require('through2')

var upperConverter = through2(write, end)

function write(chunk, encoding, next) {
  this.push(chunk.toString().toUpperCase())
  next()
}

function end(done) {
  done()
}

process.stdin.pipe(upperConverter).pipe(process.stdout)
