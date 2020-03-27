const Koa = require('koa2')
const fs = require('fs')

const app = new Koa()

app.use(async function routes (ctx) {
  switch (ctx.url) {
    case '/':
      ctx.body = `<p>${ctx.method} index page</p><p><a href="/login">login</a></p>`
      break
    case '/200':
      ctx.body = '200 OK'
      break
    case '/204':
      ctx.status = 204
      ctx.body = 'no content' // 会被app实例替换为null
      break
    case '/301':
      ctx.status = 301
      ctx.redirect('/')
      ctx.body = 'permanently moved to index'
      break
    case '/302':
      ctx.redirect('/')
      ctx.body = 'moved to index'
      break
    case '/303':
      ctx.status = 303
      ctx.method = 'GET'
      ctx.redirect('/')
      ctx.body = 'redirect with GET'
      break
    case '/400':
      ctx.status = 400
      ctx.body = ctx.message
      break
    case '/login':
      ctx.set('Set-Cookie', ['a=b; Max-Age=10; HttpOnly; Path=/; Domain=chrono.com', 'c=d'])
      ctx.body = 'login successful'
      break
    default:
      break
  }

  if (ctx.path.startsWith('/mime')) {
    let cpath = ctx.path.slice(5)
    if (ctx.method !== 'GET') {
      ctx.status = 405
      ctx.body = '<p>Can only use GET method to get static files</p>'
      return
    }
    if (!ctx.accepts('text')) {
      ctx.status = 406
      ctx.body = 'Can only return text content'
      return
    }
    switch (cpath) {
      case '/a':
        let cookie = ctx.headers['cookie']
        if (!cookie || !(/a=b/.test(cookie))) {
          ctx.status = 401
          ctx.body = '<p>Please login to get the content</p>'
        } else {
          ctx.type = 'text'
          ctx.body = fs.createReadStream('./mime/a')
        }
        break

      case '/secret':
        ctx.status = 403
        ctx.body = '<p>You are forbidden to get the secret</p>'
        break

      case '/b':
        let timer = new Date()
        await new Promise((resolve, reject) => {
          ctx.req.on('data', function(data) {
            console.log(data.toString())
          })
          ctx.req.on('end', function () {
            let spentTime = new Date().getTime() - timer.getTime()
            if (spentTime > 5000) {
              ctx.status = 408
              ctx.body = '<p>Request timeout</p>'
            } else {
              ctx.type = 'text'
              ctx.body = fs.createReadStream('./mime/b')
            }
            resolve()
          })
        })
        
        break

      default:
        ctx.status = 404
        ctx.body = '<p>source not found</p>'
    }
  }
})

app.listen(3003, () => {
  console.log('server running on port 3003...')
})
