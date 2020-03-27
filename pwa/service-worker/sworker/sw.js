self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open('v1').then(function(cache) {
      console.log('open cache v1 and add all')
      return cache.addAll([
        '/sworker/',
        '/sworker/index.html',
        '/sworker/app.js',
        '/sworker/imgs/flower-1.jpg'
      ])
    })
  )
})

self.addEventListener('activate', function (event) {
  console.log('worker activated')
})

self.addEventListener('fetch', function (event) {
  console.log('fetch start: ' + event.request.url)
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        console.log('respond by caches')
      }
      return response || fetch(event.request).then(res => {
        console.log('respond by network: ' + res)
        return caches.open('v1').then(cache => {
          cache.put(event.request, res.clone())
          return res
        })
      })
    }).catch(e => {
      let resText = 'Can not found the resource ' + event.request.url
      return new Response(resText, {
        headers: {
          'Content-Type': 'text/html',
          'Content-Length': resText.length
        }
      })
    })
  )
})
