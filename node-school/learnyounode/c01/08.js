// I want to create a static file system, not in this course

var http = require('http')
var fs = require('fs')
var path = require('path')
var url = require('url')

const TEXTEXT = ['text', 'css', 'js', 'html', 'json', 'md']
const pathDict = {}
const cmdParams = process.argv.slice(2)
const ENABLECORS = false

if (cmdParams.includes('--cors')) {
  ENABLECORS = true
}

readDir('./static')

function readDir (dirname) {
  fs.readdir(dirname, {
    withFileTypes: true
  }, (e, files) => {
    if (!e) {
      files.forEach(file => {
        let dir = dirname
        if (!dir.match(/\/$/)) {
          dir += '/'
        }
        let fname = dir + file

        fs.stat(fname, (e, stats) => {
          if (stats.isDirectory()) {
            readDir(fname)
          } else {
            fs.readFile(fname, (e, content) => {
              if (!e) {
                console.log(`read file ${fname} success`)
                pathDict[fname] = content
              } else {
                console.log(`read file ${fname} fail`)
              }
            })
          }
        })
      })
    } else {
      console.log(e)
    }
  })
}

var server = http.createServer((req, res) => {
  let body = ''

  req.setEncoding('utf-8')

  // OK, this part is NECESSARY, or req.onend will not be exceuted
  req.on('data', chunk => { 
    body += chunk
  })

  req.on('end', () => {
    console.log(`request addr is: ${req.url}`)
    let parsedUrl = url.parse(req.url)
    let pathname = parsedUrl.pathname
    if (pathname) {
      let fullPath = './static' + pathname
      if (Object.keys(pathDict).includes(fullPath)) {
        try {
          if (TEXTEXT.includes(path.extname(fullPath))) {
            res.write(pathDict[fullPath].toString())
          } else {
            res.write(pathDict[fullPath])
          }

          if (ENABLECORS) {
            res.setHeader('Access-Control-Allow-Origin', '*')
          }

          res.end()
        } catch (e) {
          res.statusCode = 400
          return res.write('error: ' + e.message)
        }

        if (ENABLECORS) {
          res.setHeader('Access-Control-Allow-Origin', '*')
        }

        res.end()
      } else {
        res.statusCode = 404
        res.end(`the parsed source: ${fullPath} doesn't exist!`)
      }
    }
    res.end('Welcome to the static file server!')
  })
})

server.listen(1337)
