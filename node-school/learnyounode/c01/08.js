// I want to create a static file system, not in this course

var http = require('http')
var fs = require('fs')
var path = require('path')
var url = require('url')

const TEXTEXT = ['text', 'css', 'js', 'html', 'json', 'md']
const pathDict = {}
const cmdParams = process.argv.slice(2)
let ENABLECORS = false
let port = 8004

if (cmdParams.includes('--cors')) {
  ENABLECORS = true
}

let pIndex = cmdParams.indexOf('-p')
if (pIndex >= 0) {
  port = cmdParams[++pIndex]
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

  // OK, this part is NECESSARY, or req.onend will not be exceuted
  req.on('data', chunk => { 
  })

  req.on('end', () => {
    console.log(`request addr is: ${req.url}`)
    let parsedUrl = url.parse(req.url)
    let pathname = parsedUrl.pathname
    if (pathname) {
      let fullPath = './static' + pathname
      if (Object.keys(pathDict).includes(fullPath)) {
        try {
          if (ENABLECORS) { // the header must be set before the contents, or nothing will be received by the client
            res.writeHead(200, {'Access-Control-Allow-Origin': '*'})
          }
          /* todo, add content-type */

          if (TEXTEXT.includes(path.extname(fullPath))) {
            res.write(pathDict[fullPath].toString())
          } else {
            res.write(pathDict[fullPath])
          }

          res.end()
        } catch (e) {
          res.statusCode = 400
          return res.end('error: ' + e.message)
        }
      } else {
        res.statusCode = 404
        res.end(`the parsed source: ${fullPath} doesn't exist!`)
      }
    }
    res.end('Welcome to the static file server!')
  })
})

server.listen(parseInt(port))
