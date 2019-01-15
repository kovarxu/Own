const path = require('path')
const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const controller = require('./controller')
const templating = require('./templating')

const app = new Koa()
const isDev = process.env.NODE_ENV === 'development'

// parse body, for POST
app.use(bodyParser())

// add nunjucks as view
app.use(templating('views', {
  noCache: isDev,
  watch: isDev
}))

// use controllers
app.use(controller())

// use static file
const static = require('koa-static')
app.use(static(path.join(__dirname, './static')))

let portId = 9000
app.listen(portId)
console.log(`listening on port ${portId}...`)
