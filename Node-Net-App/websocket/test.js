const WebSocket = require('ws')
const ws = new WebSocket('ws://127.0.0.1:3000/')

ws.on('open', () => {
  console.log('client get')
  ws.send('hello')
})

ws.on('message', (msg) => {
  console.log('client receive message ' + msg)
}) 

