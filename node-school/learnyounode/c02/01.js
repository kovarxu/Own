// do some experiments about streams

var fs = require('fs')

var rs = fs.createReadStream('lunar-lander.txt')
var ws = fs.createWriteStream('example.txt')

// rs.pipe(ws)
rs.setEncoding('utf-8')

// readable stream has 'ondata', writable stream has 'write'
rs.on('data', (chunk) => {
  console.log(chunk)
  let f = chunk.indexOf('(')
  if (f >= 0) {
    ws.write(chunk.substr(0, f))
  }
})
