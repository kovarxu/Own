// 抓取一本生物书的程序

const http = require('http')
const zlib = require('zlib')
const cheerio = require('cheerio')
const child_process = require('child_process')
const fs = require('fs')
const path = require('path')

const options = {
  hostname: 'www.100.com',
  path: '/article/309301.html',
  port: 80,
  headers: {
    'Cache-Control': 'max-age=0',
    'Upgrade-Insecure-Requests': '1',
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

  const encoding = res.headers['Content-Encoding'] || res.headers['content-encoding'] || ''

  const isChunked = res.headers['Transfer-Encoding'] === 'chunked' || res.headers['transfer-encoding'] === 'chunked'
  // const hasLength = (headers) => [204, 302] || headers['Content-Length'] !== undefined

  if (isChunked) {
    const chunks = []
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
        findImgsInContent(chunks.toString('utf8'))
      }
    })
  } else {
    res.on('data', (chunk) => {
      findImgsInContent(chunk.toString('utf8'))
    })
  }
})

function findImgsInContent (html) {
  let $ = cheerio.load(html)
  let imgs = $('.content img')
  let sources = []
  Object.keys(imgs).forEach(id => {
    let img = imgs[id]
    let url = $(img).attr('src')
    sources.push(url)
  })

  downAllSources(sources.map((source, index) => ({
    url: source,
    id: index
  })))
}

// 开五个子线程下载
function downAllSources (sources) {
  const threads = 5
  const _s = sources.slice()

  for (let i = 0; i < threads; i++) {
    downSources(_s)
  }
}

async function downSources (sources) {
  while (sources.length) {
    let fileSource = sources.shift()
    let filename = fileSource.id + path.extname(fileSource.url)
    await downFile(fileSource.url, filename)
  }
}

const DOWN_FILE_DIR_PATH = './down'

function downFile (url, filename, retry=0) {
  let child = child_process.spawn('node', ['./bin/downfile-child', url])
  
  let bufs = []
  let fileLength = 0

  child.stdout.on('data', (data) => {
    bufs.push(data)
    fileLength += data.length
  })

  child.stdout.on('end', function () {
    let savedFilePath = path.join(DOWN_FILE_DIR_PATH, filename)
    let fileData = Buffer.concat(bufs, fileLength)
    fs.writeFile(savedFilePath, fileData, (err, res) => {
      if (err) {
        console.error('写文件失败: ' + err)
      } else {
        console.log('写文件成功: ' + filename)
      }
    })
  })

  child.stderr.on('error', function (err) {
    console.error(err.toString())
  })
  
  child.on('exit', (code) => {
    if (code !== 0 && retry <= 3) {
      downFile(url, filename, retry + 1)
    } else if (retry === 3) {
      console.log(`文件${url}下载失败`)
      _resolve(false)
    }
    _resolve(true)
  })

  let _resolve = null

  return new Promise((resolve, reject) => {
    _resolve = resolve
  })
}
