// create a HTTP server and convert post data to uppercase

var http = require('http')
var through2 = require('through2')

let han = through2(write)

let sv = http.createServer((req, res) => {
  req.pipe(han).pipe(res)
})

sv.listen(process.argv[2])

function write(chunk, encoding, next) {
  this.push(chunk.toString().toUpperCase())
  next()
}
