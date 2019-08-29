// this is my own project, which handle some input css characters and mul the number in /(\d+)rem/ pattern by 1.17

var fs = require('fs')
var through2 = require('through2')

var argvs = process.argv

var filename = argvs[2]

let changeNum = through2(write, end)

if (filename) {
  let f = fs.createReadStream(filename)
  f.pipe(changeNum).pipe(process.stdout)
} else {
  process.stdin.pipe(changeNum).pipe(process.stdout)
}

function write(chunk, encoding, next) {
  let s = chunk.toString()
  this.push(s.replace(/([\d.]+)(?=rem)/g, $1 => {
    return (1.17 * $1).toFixed(2)
  }))
  next()
}

function end(done) {
  done()
}
