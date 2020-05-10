const Koa = require('koa2')
const Router = require('koa-router')
const fs = require('fs')
const path = require('path')

const app = new Koa()

const router = new Router()

const claimsRet = fs.readFileSync(path.join(__dirname, '../mime/json/claimslist.json'))
const assistRet = fs.readFileSync(path.join(__dirname, '../mime/json/assistlist.json'))

router
.get('/', ctx => {
  ctx.body = 'index page'
})
.get('/claimslist', async (ctx, next) => {
  const origin = ctx.headers['origin'] || '*'

  ctx.type = 'json'
  ctx.body = claimsRet
  ctx.set({
    'Access-Control-Allow-Origin': origin,
    "Access-Control-Allow-Credentials": "true"
  })
  await next()
})
.get('/assistlist', async (ctx, next) => {
  const origin = ctx.headers['origin'] || '*'

  ctx.type = 'json'
  ctx.body = assistRet
  ctx.set({
    'Access-Control-Allow-Origin': origin,
    "Access-Control-Allow-Credentials": "true"
  })
  await next()
})

app.use(router.routes())

app.listen(3001, () => console.log('server running on port 3001...'))
