var fs = require('fs')
var path = require('path')

module.exports = function (dirpath, ext, callback) {
  if (dirpath && ext && typeof callback === 'function') {
    fs.readdir(dirpath, (err, files) => {
      if (!err) {
        files.forEach(file => {
          if (ext === path.extname(file).slice(1)) {
            callback.call(null, file)
          }
        })
      } else {
        try {
          callback.call(null, err)
        } catch (e) {
          console.log(e)
        }
      }
    })
  }
}
