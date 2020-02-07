const Koa = require('koa2')

const app = module.exports = new Koa()

app.use(async function pageNotFound (ctx) {
  ctx.status = 404

  switch (ctx.accepts('html', 'json')) {
    case 'html':
      ctx.body = '<p>Page not found</p>'
      break
    case 'json':
      ctx.body = 'Page not found'
      break
    default:
      ctx.body = 'xxxxxxxxx no data xxxxxxxxx'
  }
})
