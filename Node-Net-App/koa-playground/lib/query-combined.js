
const Koa = require('koa2')
const path = require('path')
const fs = require('fs')
const util = require('util')

const app = module.exports = new Koa()
const access = util.promisify(fs.access)

// getPaths --- validates --- pipe

function getPaths (dir, bases) {
  let curPath = process.cwd()
  return bases.map(base => path.join(curPath, dir, base))
}

async function validates (paths) {
  for (let i = 0; i < paths.length; i++) {
    let pathname = paths[i]
    try {
      await access(pathname, fs.constants.R_OK)
    } catch (e) {
      throw new Error('file not exists: ' + pathname)
    }
  }
  return true
}

function pushToRes (paths, res) {
  let p = Promise.resolve()
  
  for (let i = 0; i < paths.length; i++) {
    let pathname = paths[i]

    p = p.then(() => {
      let _resolve = null
      let _p = new Promise((resolve, reject) => {
        _resolve = resolve
      })

      let crs = fs.createReadStream(pathname)
      crs.pipe(res, { end: false })
      crs.on('end', () => {
        _resolve()
      })

      return _p
    })
  }
  return p
}

app.use(async function queryCombined (ctx, next) {
  let p = ctx.request.path
  let parsedPath = path.parse(p)
  let { dir, base } = parsedPath

  base = base.split(/ *, */)

  let paths = getPaths(dir, base)
  console.log('paths: ', paths)

  try {
    await validates(paths)
  } catch (e) {
    ctx.status = 404
    if (ctx.request.accepts('text/html')) {
      ctx.body = `<p>${e.message}</p>`
    } else {
      ctx.body = e.message
    }
    return await next()
  }

  ctx.set('Content-Type', 'text/plain')
  ctx.status = 200
  
  await pushToRes(paths, ctx.response.res)
  ctx.response.res.end()
  
  await next()
})



