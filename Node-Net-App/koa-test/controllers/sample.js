// claims
const fs = require('fs')
const path = require('path')

module.exports = {
    'GET /img/:pid': async (ctx, next) => {
        let contentType = 'image/'
        let pid = ctx.params.pid
        if (pid) {
          if (pid.endsWith('jpg')) {
            contentType += 'jpeg'
          } else if (pid.endsWith('png')) {
            contentType += 'png'
          }
        } else {
          next();
        }
        ctx.set('Content-Type', contentType)
        ctx.set("Access-Control-Allow-Origin", "http://127.0.0.1")
        ctx.set("Access-Control-Allow-Credentials", true)
        const result = await fs.readFileSync('static/img/' + pid)
        ctx.body = result
        next()
    }
}