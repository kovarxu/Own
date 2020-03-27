const simpleServer = require('../lib/simple-server')

if (!module.parent) {
  simpleServer.listen(3003, function () {
    console.log('server running on port 3003...')
  })
}

