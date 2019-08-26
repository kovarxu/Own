// something basis things about stream, not in this course

var http = require('http')

var server = http.createServer((req, res) => {
  // req is a readable stream, res writable stream
  // req is a stream, stream inherits from EventEmitter
  let body = ''

  req.setEncoding('utf-8') // if not set this, data-type should be Buffer

  req.on('data', chunk => { // stream has an 'ondata' event
    body += chunk
  })

  req.on('end', () => {
    try {
      let reMeg = JSON.stringify(
        {
          ret: 0,
          data: body,
          errmsg: ''
        }
      )
      res.write(reMeg)
      
      console.log('body', body)

      /* use Postman give a Post request (if Get, body is '')
        body ------WebKitFormBoundaryN7XoJQlqbtYgjfMB
        Content-Disposition: form-data; name="chsdf"

        cb
        ------WebKitFormBoundaryN7XoJQlqbtYgjfMB--
      */
      
      res.end()
    } catch (e) {
      res.statusCode = 400
      return res.end('error: ' + e.message)
    }
  })
})

server.listen(1337)
