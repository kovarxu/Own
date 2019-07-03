// claims
const fs = require('fs')
const path = require('path')

module.exports = {
    'GET /data/:pid': async (ctx, next) => {
        let contentType = 'application/json'
        let pid = ctx.params.pid
        ctx.set('Content-Type', contentType)
        ctx.set("Access-Control-Allow-Origin", "*")
        const result = await fs.readFileSync('static/json/' + pid)
        ctx.body = result
        next()
    }
}