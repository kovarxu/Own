const fs = require('fs')
const child_process = require('child_process')

const spawn = child_process.spawn
const dir = 'bin/'
let filename = process.argv[2]

if (typeof filename !== 'string' || !(filename = filename.trim())) {
  throw new Error('please specify execuatable js file')
}

filename = dir + filename.replace(/\.js$/, '')

if (!fs.existsSync(filename)) {
  throw new Error('file not exist : ' + filename)
}

function execLocalFile (file) {
  const child = spawn('node', [ file ])
  child.stdout.on('data', function (data) {
    console.log(data.toString())
  })
  child.stderr.on('error', function (err) {
    console.error(err.toString())
  })
  child.on('close', function (code) {
    console.log('process ends with code: ' + code)
  })
}

execLocalFile(filename)
