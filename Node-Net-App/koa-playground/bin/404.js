const tcpChat = require('../lib/404')

if (!module.parent) {
  tcpChat.listen(3003, function () {
    console.log('server running on port 3003...')
  })
}

console.log(process.argv)
