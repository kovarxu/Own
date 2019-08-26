// read dir files, filter them by extname

var showExtInDir = require('./rfd')

var argvs = process.argv

var dirpath = argvs[2], ext = argvs[3]

showExtInDir(dirpath, ext, (res) => {
  console.log(res)
})
