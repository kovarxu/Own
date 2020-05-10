const fs = require('fs')
const filename = process.argv[2]

if (filename) {
  fs.createReadStream(filename).pipe(process.stdout)
}
