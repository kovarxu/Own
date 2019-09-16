// hello, world

const express = require('express')
const app = express()
let argvs = process.argv
let port = Number(argvs[2]) || 3000

app.get('/', (req, res) => {
  res.send('Hello world')
})

app.listen(port, () => {
  console.log('server running on port ' + port)
})
