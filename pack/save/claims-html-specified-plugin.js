
function ClaimsHTMLSpecifiedPlugin (options) {
  options = options || {}
  const defaultJSPlaceMark = 'Claims-JS-Hear'
  this.jsPlaceMark = options.jsPlaceMark || defaultJSPlaceMark
}

ClaimsHTMLSpecifiedPlugin.prototype.apply = function (compiler) {
  let self = this
  // js添加crossorigin标签
  compiler.plugin('compilation', function (compilation) {
    compilation.plugin(
      'html-webpack-plugin-alter-asset-tags',
      (data, cb) => {
        let preparedElems = data.body.concat(data.head)
        const SCRIPT_TAG_NAME = 'script'
        let jsElms = preparedElems.filter(item => item.tagName === SCRIPT_TAG_NAME)
        jsElms.forEach(jsElm => {
          let attrs = jsElm.attributes
          if (!attrs['crossorigin']) {
            attrs['crossorigin'] = 'anonymous'
          }
        })

        // 标记第一个js tag
        self.firstJSEmittedInBody = jsElms.length ? jsElms[0].attributes.src : ''

        cb(null, data)
      }
    )

    // 指定编译出的js放置的位置
    compilation.plugin(
      'html-webpack-plugin-after-html-processing',
      (data, cb) => {
        const markReg = new RegExp('<!--\\s\*' + this.jsPlaceMark + '\\s\*-->')
        let html = data.html
        console.log(html)
        if (markReg.test(html)) {
          // 查找所有插入的js
          const endJSTagsReg = new RegExp('(<script[^<]*?' + self.firstJSEmittedInBody + '>.*?)<\/body>')
          console.log('endJSTagsReg', endJSTagsReg.source)
          
          let result = html.match(endJSTagsReg)
          if (result) {
            let htmlAfterDelEmit = html.replace(result[1], '')
            data.html = htmlAfterDelEmit.replace(markReg, result[1])
          }
        }

        cb(null, data)
      }
    )
  })
}

function escape (str) {
  return str.replace(/[\/]/g, $1 => '/' + $1)
}

module.exports = ClaimsHTMLSpecifiedPlugin
