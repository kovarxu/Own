// claims
const fs = require('fs')
const path = require('path')

module.exports = {
    'GET /pixitx/:pid': async (ctx, next) => {
        let pid = ctx.params.pid
        if (pid.endsWith('.json')) {
          ctx.set('Content-Type', 'application/json')
        } else if (pid.endsWith('.png')) {
          ctx.set('Content-Type', 'image/png')
        } else {
          next()
        }
        ctx.set("Access-Control-Allow-Origin", "*")
        const result = await fs.readFileSync('static/pixiuse/' + pid)
        ctx.body = result
        next()
    }
}