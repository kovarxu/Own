const server = require('./controller.js')

const host = '127.0.0.1'
const port = 3000

server.listen(port, host, () => {
  console.log('server listen on port 3000 ...')
})
