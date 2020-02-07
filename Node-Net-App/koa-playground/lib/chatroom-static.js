const fs = require('fs')
const path = require('path')
const Koa = require('koa2')
const mime = require('mime')

const FILE_CACHE = Object.create(null)
const app = module.exports = new Koa()

function getFullPath (filename) {
  const commonPath = './mime'
  return path.join(commonPath, filename)
}

function response404 (ctx, filename) {
  const notFountStr = `<p>property not found: ${filename || ''}</p>`

  ctx.status = 404
  ctx.set({
    'Content-type': 'text/html',
    'Content-length': Buffer.byteLength(notFountStr)
  })

  ctx.body = notFountStr
}

function responseFile (ctx, filename) {
  ctx.set({
    'Content-Type': mime.getType(filename)
  })

  let fullPath = getFullPath(filename)

  return new Promise((resolve, reject) => {
    if (FILE_CACHE[fullPath]) {
      resolve(FILE_CACHE[fullPath])
    } else {
      fs.readFile(fullPath, (err, data) => {
        if (err) {
          reject(err)
        }
  
        let sdata = data.toString()
        let dataLength = Buffer.byteLength(sdata)

        resolve({ sdata, dataLength })
      })
    }
  }).then((fileData) => {
    ctx.set({
      'Content-length': fileData.dataLength
    })

    FILE_CACHE[fullPath] = fileData
    
    return (ctx.body = fileData.sdata)
  })
}

function checkFileExists (filename) {
  let fullPath = getFullPath(filename)

  return new Promise((resolve, reject) => {
    fs.access(fullPath, fs.constants.R_OK, (err) => {
      if (err) {
        reject(err)
      }
      resolve()
    })
  })
}

const STATIC_URL_PREFIX = 'static/'

app.use(async function staticFile (ctx, next) {
  if (ctx.path.indexOf(STATIC_URL_PREFIX) >= 0) {
    // static file
    let filename = ctx.path.split('/')
    filename = filename[filename.length - 1]
    try {
      await checkFileExists(filename)
    } catch (e) {
      return await response404(ctx, filename)
    }

    await responseFile(ctx, filename)
  }

  await next()
})

