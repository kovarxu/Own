
import http from 'http'
import fs from 'fs'
import path from 'path'
import { DOWN_FILE_DIR_PATH } from './config'

process.on('message', (msg) => {
  let [ fileUrl, filename ] = msg.toString().split('|')
  if (fileUrl && filename) {
    getFile(fileUrl)
      .then((data) => saveFile(filename, data))
      .catch(e => console.error(e.message))
      .then(done)
  }
})

function getFile(fileUrl: string, retry: number = 0): Promise<any> {
  return httpGetFile(fileUrl).catch(e => {
    if (retry <= 3) {
      return getFile(fileUrl, retry + 1)
    } else {
      throw new Error(`${e}: 无法下载文件 ${fileUrl}`)
    }
  })
}

function httpGetFile (fileUrl: string): Promise<SaveContext> {
  return new Promise((resolve, reject) => {
    http.get(fileUrl, (res) => {
      let bufs: Array<Buffer> = []
      let fileLength = 0
  
      if (res.statusCode === 200) {
        res.on('data', (data) => {
          bufs.push(data)
          fileLength += data.length
        })

        res.on('end', () => {
          resolve({ bufs, fileLength } as SaveContext)
        })
      } else {
        reject(res.statusCode + ' ' + res.statusMessage)
      }
    })
  })
}

function saveFile (filename: string, data: SaveContext): Promise<void> {
  let savedFilePath = path.join(DOWN_FILE_DIR_PATH, filename)
  let fileData = Buffer.concat(data.bufs, data.fileLength)
  let _resolve: Function
  
  fs.writeFile(savedFilePath, fileData, (err) => {
    if (err) {
      console.error('写文件失败: ' + err)
    } else {
      console.log('写文件成功: ' + filename)
    }
    _resolve()
  })

  return new Promise((resolve) => {
    _resolve = resolve
  })
}

function done () {
  (<Function>process.send)('done')
}

