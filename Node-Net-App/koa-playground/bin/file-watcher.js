const fs = require('fs')
const path = require('path')

const mimeDirPath = './mime'

fs.readdir(mimeDirPath, (err, files) => {
  console.log(files)
})

recursiveWatchDir(mimeDirPath, noticeCb)

function noticeCb (eventType, filename) {
  // eventType: rename / change
  console.log(`${eventType}: ${filename}`)
}

function recursiveWatchDir (dir, cb) {
  fs.watch(dir, cb)
  fs.readdir(dir, (err, files) => {
    files.forEach(file => {
      let filepath = path.join(dir, file)
      fs.stat(filepath, (err, stats) => {
        if (err) {
          throw new Error('get stat error: ' + err)
        }
        if (stats.isDirectory()) {
          recursiveWatchDir(path.join(dir, file), cb)
        }
      })
    })
  })
}

