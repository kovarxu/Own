
const http = require('http')
const fs = require('fs')
const path = require('path')

process.on('message', (msg) => {
  let [ fileUrl, filename ] = msg.toString().split('|')
  if (fileUrl && filename) {
    getFile(fileUrl)
      .then((data) => saveFile(filename, data))
      .catch(e => console.error(e.message))
      .then(done)
  }
})

function getFile(fileUrl, retry=0) {
  return httpGetFile(fileUrl).catch(e => {
    if (retry <= 3) {
      return getFile(fileUrl, retry + 1)
    } else {
      throw new Error(`${e}: 无法下载文件 ${fileUrl}`)
    }
  })
}

function httpGetFile (fileUrl) {
  return new Promise((resolve, reject) => {
    http.get(fileUrl, (res) => {
      let bufs = []
      let fileLength = 0
  
      if (res.statusCode === 200) {
        res.on('data', (data) => {
          bufs.push(data)
          fileLength += data.length
        })

        res.on('end', () => {
          resolve({ bufs, fileLength })
        })
      } else {
        reject(res.statusCode + ' ' + res.statusMessage)
      }
    })
  })
}

const DOWN_FILE_DIR_PATH = './down'

function saveFile (filename, data) {
  let savedFilePath = path.join(DOWN_FILE_DIR_PATH, filename)
  let fileData = Buffer.concat(data.bufs, data.fileLength)
  
  fs.writeFile(savedFilePath, fileData, (err, res) => {
    if (err) {
      console.error('写文件失败: ' + err)
    } else {
      console.log('写文件成功: ' + filename)
    }
    _resolve()
  })

  let _resolve = null

  return new Promise((resolve, reject) => {
    _resolve = resolve
  })
}

function done () {
  process.send('done')
}

