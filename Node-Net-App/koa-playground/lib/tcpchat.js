const net = require('net')
const events = require('events')

const channel = new events.EventEmitter()
channel.clients = {}
channel.subscriptions = {}

channel.on('join', (id, client) => {
  channel.clients[id] = client
  channel.subscriptions[id] = (sid, msg) => {
    if (id !== sid) {
      channel.clients[id].write(msg)
    }
  }
  channel.on('broadcast', channel.subscriptions[id])
})

channel.on('leave', (id) => {
  console.log('left id: ' + id)
  console.log('maintained ip: ' + Object.keys(channel.clients))
  if (channel.clients[id]) {
    channel.removeListener('broadcast', channel.subscriptions[id])
    channel.clients[id] = null
    channel.emit('broadcast', id, 'a user lost')
  }
})

const server = module.exports = net.createServer((client) => {
  let id = client.remoteAddress + ':' + client.remotePort
  // telnet can't trigger this in windows
  server.once('connection', () => {
    console.log('a user join in')
    channel.emit('join', id, client)
  })

  client.on('data', (data) => {
    console.log('broadcastting: ' + data.toString())
    channel.emit('broadcast', id, data.toString())
  })

  client.on('close', () => {
    channel.emit('leave', id)
  })
})


