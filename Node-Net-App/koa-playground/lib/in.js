const http = require('http')

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain', 'Content-Length': '1' })
  res.end('www.chrono.com')
})

server.listen(3003, () => {
  console.log('server running on port 3003')
})
