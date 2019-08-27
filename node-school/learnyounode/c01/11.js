// recieves only POST requests and converts incoming body characters to upper-case and returns it to the client

var http = require('http')

var argvs = process.argv
var port = argvs[2]

if (!port) { console.log('you should provide a port'); process.exit() }

var sv = http.createServer((req, res) => {
  let isPost = req.method.toUpperCase() === 'POST'
  if (isPost) {
    // first
    req.on('readable', () => {
      let chunk = req.read()
      if (chunk) {
        console.log('chunk: ' + chunk)
        let tx = chunk.toString().toUpperCase()
        let re = /^\w+$|(?<==\")\w+(?=\")/mg
        let result = tx.match(re)
        if (result) {
          result.forEach((item) => {
            res.write(item + '\r\n')
          })
        }
      } else {
        res.end()
      }
    })
  } else {
    res.statusCode = 400
    res.end('can only receive POST requests')
  }
})

sv.listen(port, '0.0.0.0')
