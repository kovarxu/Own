const WebSocket = require('ws')

const WebSocketServer = WebSocket.Server

const wss = new WebSocketServer({
  port: 3000
}, () => {
  console.log('start server successfully...')
})

wss.on('connection', (ws) => {
  ws.on('message', (msg) => {
    console.log(`receive message: ${msg}.`)
    ws.send(`ECHO: ${msg}.`, (err) => {
      // 如果err有返回，则此返回为错误信息
      if (err) {
        console.log('Server error: ' + err)
      }
    })
  })
})
