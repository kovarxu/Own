const fs = require('fs')
const path = require('path')
const mime = require('mime')

const FILE_CACHE = Object.create(null)

const htmlFilePath = './html'
const staticFilePath = './mime'

function getFullPath (filename) {
  if (filename.endsWith('.html')) {
    return path.join(htmlFilePath, filename)
  } else {
    return path.join(staticFilePath, filename)
  }
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

module.exports = async function staticFile (ctx, next) {
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
  } else if (ctx.path === '/') {
    await responseFile(ctx, 'chatroom.html')
  }

  await next()
}

