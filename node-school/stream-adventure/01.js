// read from file and pipe it to stdout

var fs = require('fs')

var argvs = process.argv

var filename = argvs[2]

if (filename) {
  fs.createReadStream(filename).pipe(process.stdout)
}
