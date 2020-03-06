function initMainPage () {
  const appContainer = $('#app')
  appContainer.innerHTML = `
  <div>图片是：<img src="/sworker/imgs/flower-1.jpg" width=100 height=100 /></div>
  <div><button id="btn">再次获取图片</button></div>
  `
}

function $ (sel) {
  return document.querySelector(sel)
}

function initServiceWorker() {
  if ('serviceWorker' in navigator) {
    return navigator.serviceWorker.register('/sworker/sw.js', { scope: '/sworker/' }).then(reg => {
      console.log('regiester service worker: ' + reg.scope)
    }).catch(e => {
      console.log('register failed with ' + e)
    })
  }
  return Promise.resolve()
}

window.onload = function () {
  initServiceWorker().then(() => {
    initMainPage()
  })
}
