// use concat-stream module to get the complete contents of a stream as a single buffer

var concat = require('concat-stream')
// var fs = require('fs')

var strings = concat({encoding: 'string'}, body => {
  process.stdout.write(body.split('').reverse().join(''))
})

// var rs = fs.createReadStream('./test')
process.stdin.pipe(strings)

