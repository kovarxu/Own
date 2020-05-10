var through = require('through2')
var split = require('split2')

var lineCount = 0

function mapper(line) {
  return lineCount++ % 2 === 0
    ? line.toLowerCase() + '\n'
    : line.toUpperCase() + '\n'
}

process.stdin
  .pipe(split(mapper))
  .pipe(process.stdout)
