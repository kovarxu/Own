// claims
const fs = require('fs')

let json = {
    "hello": "kovar"
}

module.exports = {
    'GET /claims': async (ctx, next) => {
        ctx.set('Content-Type', "application/json")
        ctx.set("Access-Control-Allow-Origin", "*")
        const result = await fs.readFileSync('static/json/sample.json')
        ctx.body = result
        next()
    }
}