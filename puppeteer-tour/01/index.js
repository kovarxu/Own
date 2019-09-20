// display the screenshot of a websit
const puppeteer = require('puppeteer')

;(async() => {
  const browser = await puppeteer.launch({
    defaultViewport: {
      width: 1500,
      height: 900
    }
  })
  const page = await browser.newPage()
  await page.goto('https://www.xiaoyusan.com', {
    timeout: 5000,
    waitUntil: 'load'
  })
  console.log('have navigated to "xiaoyusan.com"')
  await page.screenshot({
    path: 'hn.jpg',
    quality: 70,
    fullPage: false
  })
  console.log('browser will exit')
  await browser.close()
})()
