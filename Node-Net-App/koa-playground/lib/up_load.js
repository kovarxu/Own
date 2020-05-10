const Koa = require('koa2')
const middleWare = require('./middleware')

const app = module.exports = new Koa()

app.use(middleWare)

app.use(ctx => {
  ctx.body = `Request Fields: ${JSON.stringify(ctx.fields)}, Request Body: ${ctx.file}`;
})
