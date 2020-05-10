const Koa = require('koa2')

const app = module.exports = new Koa()
const path = require('path')

app.use(function routes (ctx, next) {
  switch(ctx.method) {
    case 'POST':
      let item = ''
      ctx.request.req.on('data', (data) => {
        item += data.toString()
      })
      ctx.request.req.on('end', () => {
        items.push(item)
      })
      ctx.body = item
      break
    case 'GET':
    default:
      ctx.body = 'hi!'
  }
  next()
})
