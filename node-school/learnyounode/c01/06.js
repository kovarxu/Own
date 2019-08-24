// a very simple tcp server

var net = require('net')

var argvs = process.argv

var port = argvs[2]

function tcpLink (port) {
  const sv = net.createServer((socket) => {
    let address = socket.address()
    console.log('socket address: ' + address.address + ' ' + address.family + ' ' + address.port)

    socket.end(formatTime(new Date), () => {
      console.log('socket collection end.')
    }) // the same as socket.write(now) in this example
  })

  sv.on('error', err => {
    console.log(err)
  })

  return sv
}

function formatTime (date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`.replace(/\d+/g, unit => unit.length === 1 ? '0'+unit : unit) + '\n'
}

tcpLink().listen(port, () => {
  console.log('open tcp server on port: ' + port)
})
