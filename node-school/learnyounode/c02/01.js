// do some experiments about streams

var fs = require('fs')

var rs = fs.createReadStream('lunar-lander.txt')
var ws = fs.createWriteStream('example.txt')

rs.pipe(ws)

rs.setEncoding('utf-8')

// readable stream has 'ondata', writable stream has 'write'
rs.on('data', (chunk) => {
  console.log(chunk.substr(0, 20))
  let f = chunk.indexOf('(')
  if (f >= 0) {
    console.log('write in on data')
    if (ws.write('美国\r\n')) {
      console.log('buffer has been consumed')
    } else {
      console.log('chunk has been buffered')
    }
  }
})
