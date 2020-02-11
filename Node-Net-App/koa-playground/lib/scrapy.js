// 抓取一本生物书的程序

const http = require('http')
const fs = require('fs')

const distSite = 'http://www.100.com/article/309301.html'

http.request(distSite, (res) => {
  console.log(`状态码: ${res.statusCode}`)
  console.log(`响应头: ${JSON.stringify(res.headers)}`)
  res.setEncoding('utf-8')
  res.on('data', (chunk) => {
    console.log('响应主体: ' + chunk)
  })
  res.on('end', () => {
    console.log('已无响应主体')
  })
})

