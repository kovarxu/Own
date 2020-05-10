var fs = require('fs')

fs.readFile('./tcpchat.js', () => {
  setTimeout(() => {
    console.log('setTimeout')
  }, 0)

  setImmediate(() => {
    console.log('setImmediate')
  })
})

new Promise((resolve, reject) => {
  resolve()
}).then(() => {
  console.log('in Promise')
})

process.nextTick(() => {
  console.log('nextTick')
})

