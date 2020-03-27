const http = require('http')

let fileUrl = process.argv[2]

http.get(fileUrl, (res) => {
  if (res.statusCode === 200) {
    res.pipe(process.stdout)
  } else {
    exit(1000)
  }
})

