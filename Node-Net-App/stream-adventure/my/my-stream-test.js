const jsonTransformer = require('./my-transform-1')
const Ws = require('./my-writable')
const fs = require('fs')
const path = require('path')
const concat = require('concat-stream')

const tr = jsonTransformer({ readableObjectMode: true })
fs.createReadStream(path.resolve(__dirname, './data.json')).pipe(tr).pipe(new Ws)
// .pipe(process.stdout)
