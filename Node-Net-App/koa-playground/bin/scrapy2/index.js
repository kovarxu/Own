// 抓取一本生物书的程序

const http = require('http')
const zlib = require('zlib')
const cheerio = require('cheerio')
const child_process = require('child_process')
const path = require('path')

const options = {
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
  let sources = ['http://dev.xinhulu.com/go.jpg']
  Object.keys(imgs).forEach(id => {
    let img = imgs[id]
    let url = $(img).attr('src')
    sources.push(url)
  })

  downAllSources(sources.map((source, index) => ({
    url: source,
    id: index
  })).slice(0,3))
}

// 最多开五个子线程下载
function downAllSources (sources) {
  const MAX_THREADS = 5
  const threads = sources.length < 5 ? sources.length : MAX_THREADS
  const _s = sources.slice()

  for (let i = 0; i < threads; i++) {
    let child = child_process.fork(path.join(__dirname, 'down-file-new'))

    child.on('message', (msg) => {
      if (_s.length) {
        let fileSource = _s.shift()
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
      let fileSource = _s.shift()
      let filename = fileSource.id + path.extname(fileSource.url)
      child.send(fileSource.url + '|' + filename)
    }
  }
}
