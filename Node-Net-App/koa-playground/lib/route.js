const fs = require('fs')
const path = require('path')
const util = require('util')
const formidable = require('formidable')
const Koa = require('koa2')
const Router = require('koa-router')
const body = require('koa-bodyparser')

const app = module.exports = new Koa()
const router = new Router()

// 命名前缀
// router.prefix('/me')

router.get('/', (ctx, next) => {
  ctx.body = 'index'
})

// 命名路由
router.get('friend', '/friend/:id', (ctx, next) => {
  ctx.body = ctx.params.id
})

// router.use('/file', plugin()

let fu = router.url('friend', 3)
console.log('fu ' + fu)

router
.options('/static/pic', (ctx, next) => {
  let reqMethod = ctx.headers['access-control-request-method']
  let origin = ctx.headers['origin'] || '*'
  console.log(util.inspect(ctx.headers))

  if (/get/i.test(reqMethod)) {
    ctx.set({
      'Access-Control-Allow-Method': 'GET',
      'Access-Control-Allow-Headers': 'X-Pong',
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Max-Age': '5000'
    })
    ctx.status = 204
  } else {
    ctx.status = 405
    ctx.body = '<p>This resource can only be preflight by GET.</p>'
  }
})
.get('/static/pic', (ctx, next) => {
  let origin = ctx.headers['origin'] || '*'
  let filePath = path.resolve(__dirname, '../mime/pic.jpg')
  ctx.set('Access-Control-Allow-Origin', origin)
  ctx.type = path.extname(filePath)
  ctx.body = fs.createReadStream(filePath)
})

// echo
.get('/echo', ctx => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.resolve(__dirname, '../html/form.html'), (err, file) => {
      if (err) {
        reject(err.code + ' ' + err.message)
      }
      ctx.body = file.toString()
      resolve()
    })
  })
})

// 下载
.get('/download', ctx => {
  ctx.set({
    'Content-Disposition': 'attachment; filename=pic.jpg'
  })
  ctx.type = 'image/jpeg'
  ctx.body = fs.createReadStream(path.resolve(__dirname, '../mime/pic.jpg'))
})

// {"fields":{"name":"MickFone","age":"58","like":"0"},"files":{"avatar":{"size":54,"path":"C:\\Users\\ChaoXu PC\\AppData\\Local\\Temp\\upload_0ddb03b6edf5b2c4c18d03f07e18b29f","name":"新建文本文档.txt","type":"text/plain","mtime":"2020-02-13T10:47:03.510Z"}}}
async function formidableFormParser (ctx, next) {
  if (ctx.method === 'POST') {
    const form = formidable()
    return new Promise((resolve, reject) => {
      // form.on('file', (filename, file) => {
      //   console.log(filename + util.inspect(file))
      // })

      form.parse(ctx.request.req, (err, fields, files) => {
        if (err) {
          throw err
        }
        ctx.type = 'application/json'
        ctx.body = JSON.stringify({ fields, files })
        resolve(next())
      })
    })
  }
  await next()
}

// app.use(body())
app.use(formidableFormParser)
// app.use(optionsRequest)
app.use(router.routes())
// 处理OPTIONS请求
app.use(router.allowedMethods())

