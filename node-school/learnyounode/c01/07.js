// I want to create a stream to return an image, not in this course

var http = require('http')
var fs = require('fs')

const FILENAME = './nep.png'

var server = http.createServer((req, res) => {
  let body = ''

  req.setEncoding('utf-8')

  // OK, this part is NECESSARY, or req.onend will not be exceuted
  req.on('data', chunk => { 
    body += chunk
  })

  req.on('end', () => {
    console.log('request end')
    try {
      fs.readFile(FILENAME, (e, content) => { // this is enough
        console.log('now handling')
        if (!e) {
          res.end(content)
        } else {
          res.end('error')
        }
      })
    } catch (e) {
      res.statusCode = 400
      return res.end('error: ' + e.message)
    }
  })
})

server.listen(1337)
