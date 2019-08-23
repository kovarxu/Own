var http = require('http')

var argvs = process.argv

var dest = argvs[2]

http.get(dest, (res) => {
  const { statusCode, headers } = res
  if (statusCode !== 200) {
    console.log('get request failed with status code ' + statusCode)
  } else {
    // if (!headers['content-type'] || !headers['content-type'].match(/text/)) return

    res.setEncoding('utf-8')
    let rawdata = ''

    res.on('data', (chunk) => {
      rawdata += chunk
    })

    res.on('end', () => {
      console.log(rawdata.length)
      console.log(rawdata)
    })

    res.on('error', (e) => {
      throw new Error(e.toString())
    })
  }
})
