const fs = require('fs')

function readControllerFromDir (dir) {
  const router = require('koa-router')()
  const controller_dir = dir || 'controllers'
  addControllers(router, controller_dir)
  return router.routes()
}

function addControllers (router, dir) {
  fs.readdirSync(__dirname + '\\' + dir).filter((f) => {
    return f.endsWith('.js')
  }).forEach((f) => {
    let mapping = require(__dirname + '\\' + dir + '\\' + f)
    addMapping(router, mapping)
  })
}

function addMapping (router, mapping) {
  for (let url in mapping) {
    if (url.startsWith('GET ')) {
      let path = url.substring(4)
      router.get(path, mapping[url])
      console.log(`register GET mapping at ${path}`)
    } else if (url.startsWith('POST')) {
      let path = url.substring(5)
      router.post(path, mapping[url])
      console.log(`register POST mapping at ${path}`)
    }
  }
}

module.exports = readControllerFromDir
