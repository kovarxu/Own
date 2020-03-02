function initMainPage () {
  const appContainer = $('#app')
  appContainer.innerHTML = `
  <div>图片是：<img src="/static/imgs/flower.jpg" /></div>
  `
}

function $ (sel) {
  return document.querySelector(sel)
}

function initServiceWorker() {
  if ('serviceworker' in navigator) {
    return navigator.serviceworker.regiester('/sworker/sw.js', '/sworker/').then(reg => {
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
