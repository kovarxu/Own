// Here's the reference solution:

const port = process.argv[2] || 3000

var http = require('http')
var through = require('through2')

function _transform (buffer, encoding, callback) {
  this.push(buffer.toString().toUpperCase())
  callback()
}

function _flush(callback) {
  callback()
}

var server = http.createServer(function (req, res) {
  if (req.method === 'POST') {
    req.pipe(through(_transform, _flush)).pipe(res)
  } else res.end('send me a POST\n')
})

server.listen(parseInt(port))
