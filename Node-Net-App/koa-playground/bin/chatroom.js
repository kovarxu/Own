
if (module.parent) return false

const Koa = require('koa2')
const staticFileMiddleWare = require('../lib/chatroom-static')
const socketLogic = require('../lib/chatroom-socketio')

const app = new Koa()


app.use(staticFileMiddleWare)

const server = require('http').createServer(app.callback());

socketLogic(server)

server.listen(3003, function () {
  console.log('server running on port 3003...')
})
