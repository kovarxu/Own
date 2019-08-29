// use `split` module to split '\r\n' into chunks
// use `through2` module to convert chunk data

var through2 = require('through2')
var split = require('split')

var upperConverter = through2(write, end)
var n = 1

function write(chunk, encoding, next) {
  if (n % 2 === 1) {
    this.push(chunk.toString().toLowerCase() + '\n')
  } else {
    this.push(chunk.toString().toUpperCase() + '\n')
  }
  ++n
  next()
}

function end(done) {
  done()
}

process.stdin.pipe(split()).pipe(upperConverter).pipe(process.stdout)
