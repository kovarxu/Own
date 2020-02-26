const Koa = require('koa2')

const app = module.exports = new Koa()
const path = require('path')

let items = []

console.log(process.argv)
console.log(__dirname) // 文件所在地
console.log(path.resolve('abc', '345', '../456')) // 命令行执行时所在的目录

app.use(async function routes (ctx, next) {
  switch (ctx.method) {
    case 'POST':
      let item = ''
      ctx.request.req.on('data', (data) => {
        item += data.toString()
      })
      ctx.request.req.on('end', () => {
        items.push(item)
      })
      ctx.body = 'write successful'
      break
    case 'GET':
      let ret = items.reduce((cum, t, i) => `${cum}${i}) ${t}\n` , '')
      ctx.body = ret
      break
  }

  await next()
})

// const http = require('http')
// http.createServer((req, res) => {
//   res.setHeader('Content-Length', 12)
//   res.setHeader('set-cookie', 'q=222')
//   res.end('ok i am hear')
//   console.log(res._headers)
// }).listen(3004)
