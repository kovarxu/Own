import http from 'http'
import zlib from 'zlib'
import cheerio from 'cheerio'
import child_process from 'child_process'
import path from 'path'
import fs from 'fs'
import { MAX_THREADS, DOWN_FILE_DIR_PATH } from './config'

const options: http.RequestOptions = {
  hostname: 'www.100.com',
  path: '/article/309301.html',
  port: 80,
  headers: {
    'Cache-Control': 'max-age=0',
    'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36",
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
    'Accept-Encoding': 'gzip, deflate',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
  },
  timeout: 3000
}

http.get(options, (res) => {
  console.log(`状态码: ${res.statusCode}`)
  console.log(`响应头: ${JSON.stringify(res.headers)}`)

  const encoding = res.headers['content-encoding'] || ''
  const isChunked = res.headers['transfer-encoding'] === 'chunked'

  if (isChunked) {
    const chunks: Array<Buffer> = []
    let totalLength = 0

    res.on('data', (chunk) => {
      chunks.push(chunk)
      totalLength += chunk.length
    })

    res.on('end', () => {
      let newBuf = Buffer.concat(chunks, totalLength)
      if (/gzip/.test(encoding)) {
        zlib.gunzip(newBuf, (err, result) => {
          if (err) {
            console.error(err)
            return 
          }
          findImgsInContent(result.toString('utf8'))
        })
      } else {
        findImgsInContent(chunks.toString())
      }
    })
  } else {
    res.on('data', (chunk) => {
      findImgsInContent(chunk.toString('utf8'))
    })
  }
})

function findImgsInContent (html: string): void {
  let $ = cheerio.load(html)
  let imgs = $('.content img')
  let sources: Array<ImageContext> = []

  Object.keys(imgs).forEach(id => {
    let img = imgs[+id]
    let url = $(img).attr('src')
    if (url) {
      sources.push({ url, id})
    }
  })

  if (sources.length) {
    checkAndCreateDir(DOWN_FILE_DIR_PATH)
    downAllSources(sources.slice(0,3))
  }
}

function checkAndCreateDir (path: string): void {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true })
  }
}

function downAllSources (sources: ImageContext[]) {
  const threads = sources.length < MAX_THREADS ? sources.length : MAX_THREADS
  const _s = sources.slice()

  for (let i = 0; i < threads; i++) {
    let child = child_process.fork(path.join(__dirname, 'down-file'))

    child.on('message', () => {
      if (_s.length) {
        let fileSource = _s.shift() as ImageContext
        let filename = fileSource.id + path.extname(fileSource.url)
        child.send(fileSource.url + '|' + filename)
      } else {
        child.disconnect()
      }
    })

    child.on('exit', (code) => {
      console.log('child process exit with code ' + code)
    })
  
    if (_s.length) {
      let fileSource = _s.shift() as ImageContext
      let filename = fileSource.id + path.extname(fileSource.url)
      child.send(fileSource.url + '|' + filename)
    }
  }
}
