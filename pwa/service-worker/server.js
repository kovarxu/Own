const fs = require('fs')
const path = require('path')
const Koa = require('koa2')
const Router = require('koa-router')

const router = new Router()
// router.prefix('/sworker')

app = new Koa()

// 代理文件
router.get(/^\/sworker\/(.*?)\s*$/, ctx => {
  let fpath = ctx.captures[0]
  if (!fpath) fpath = 'index.html'
  return respondFileWithPromise(ctx, fpath)
})

// app.use(optionsRequest)
app.use(router.routes())
// 处理OPTIONS请求
app.use(router.allowedMethods())

const textFileExts = ['.js', '.css', '.html']

function respondFileWithPromise (ctx, rpath) {
  let fpath = path.resolve(__dirname, 'sworker/', rpath)
  console.log('fpath: ' + fpath)
  let ext = path.extname(fpath)

  return new Promise((resolve, reject) => {
    fs.readFile(fpath, (err, file) => {
      if (err) {
        reject(err.code + ' ' + err.message)
      } else {
        ctx.body = textFileExts.includes(ext) ? file.toString() : file
        ctx.type = ext
        console.log(new Date().toLocaleString() + ': ' + rpath)
        resolve(file)
      }
    })
  }).catch(e => {
    console.log(e)
  })
}

const port = 8068
app.listen(port, () => {
  console.log('server running on port ' + port)
})
