var http = require('http')

var argvs = process.argv

var [dest1, dest2, dest3] = argvs.slice(2)

var raws = {
  dest1: {url: dest1, content: ''},
  dest2: {url: dest2, content: ''},
  dest3: {url: dest3, content: ''},
}

Object.keys(raws).forEach(key => {
  getDestContent(raws[key].url).then(raw => {
    raws[key].content = raw
    if (checkRaws(raws)) printRaws(raws)
  }, err => {
    console.log(err)
  })
})

function checkRaws () {
  Object.keys(raws).forEach(key => {
  })
}

function getDestContent (dest) {
  return new Promise((resolve, reject) => {
    http.get(dest, (res) => {
      const { statusCode, headers } = res
      if (statusCode !== 200) {
        console.log('get request failed with status code ' + statusCode)
      } else {
        res.setEncoding('utf-8')
        let rawdata = ''
    
        res.on('data', (chunk) => {
          rawdata += chunk
        })
    
        res.on('end', () => {
          resolve(rawdata)
        })
    
        res.on('error', (err) => {
          reject(err)
        })
      }
    })
  })
}
