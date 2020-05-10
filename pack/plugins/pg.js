// webpack3 can use this plugin

var fs = require('fs')

function MyPlugin(options) {
  // Configure your plugin with options...
}

MyPlugin.prototype.apply = function (compiler) {
  compiler.plugin('compilation', (compilation) => {
    console.log('The compiler is starting a new compilation...')

    compilation.plugin(
      'html-webpack-plugin-before-html-generation',
      (data, cb) => {
        let options = data.plugin.options
        let mixins = options.mixins, gStrings = {}
        if (mixins && mixins.length) {
          mixins.forEach((mix, index) => {
            console.log('mix', mix)
            fs.readFile(mix, (err, fd) => {
              if (err) throw err
              // todo
              cb(null, data)
            })
          })
        } else {
          cb(null, data)
        }
      }
    )

    compilation.plugin(
      'html-webpack-plugin-alter-asset-tags',
      (data, cb) => {
        // console.log(data)
        let bodyElms = data.body
        const SCRIPT_TAG_NAME = 'script'
        let jsElms = bodyElms.filter(item => item.tagName === SCRIPT_TAG_NAME)
        jsElms.forEach(jsElm => {
          let attrs = jsElm.attributes
          if (!attrs['crossorigin']) {
            attrs['crossorigin'] = 'anonymous'
          }
        })
        
        cb(null, data)
      }
    )

    compilation.plugin(
      'html-webpack-plugin-after-html-processing',
      (data, cb) => {
        let html = data.html, match, matches = []
        const REG_SCRIPT_WITH_WEIGHT = /[\t ]*<script[^>]+(?<=\s+)data-weight=(["']?)([\d-]+)\1[\s\S]*?<\/script>\r?\n?/g
        while (match = REG_SCRIPT_WITH_WEIGHT.exec(html)) {
          matches.push({
            idx: Number(match[2]),
            content: match[0]
          })
        }
        if (matches.length) {
          matches.sort((am, bm) => am.idx - bm.idx)
          let mstring = '\r\n'
          matches.forEach(match => mstring += match.content)

          html = html.replace(REG_SCRIPT_WITH_WEIGHT, '').replace(/(?=<\/body>)/, mstring)
          data.html = html
        }

        cb(null, data)
      }
    )
  })
}

module.exports = MyPlugin
