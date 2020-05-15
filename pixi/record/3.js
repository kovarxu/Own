import * as PIXI from 'pixi.js'
// loader demo

const canvas = document.createElement('canvas')

const app = new PIXI.Application({
  view: canvas,
  width: window.innerWidth,
  height: window.innerHeight
})

// const loader = new PIXI.loader()
const loader = PIXI.Loader.shared
// loader.onComplete.add(handleAddComplete)
// loader.onLoad.add(handleLoad)
// loader.onProgress.add(handleProgress)
// loader.onError.add(handleError)

// loader.add('http://127.0.0.1:5000/assets/eggHead.png')
// loader.add('http://127.0.0.1:5000/assets/flowerTop.png')
// loader.add('http://127.0.0.1:5000/assets/helmlok.png')
// loader.add('http://127.0.0.1:5000/assets/skully.png')
// loader.load()

function addAliasAndLoad(loader, url) {
  const fileMatch = url.match(/([^\/]+)\.([\w]+)$/)
  if (fileMatch) {
    const [ _, filename, fileExtName ] = fileMatch
    loader.add(filename, url)
  }
  return loader
}

const urls = [
  'http://127.0.0.1:5000/assets/eggHead.png',
  'http://127.0.0.1:5000/assets/flowerTop.png',
  'http://127.0.0.1:5000/assets/helmlok.png',
  'http://127.0.0.1:5000/assets/skully.png',
]

urls.reduce(addAliasAndLoad, loader)
    .on('load', handleLoad)
    .on('progress', handleProgress)
    .on('complete', handleAddComplete)
    .on('error', handleError)
    .load()

function handleAddComplete(loader) {
  console.log('handle complete ' + Object.keys(loader.resources))
  const texture = loader.resources['eggHead'].texture
  const img = new PIXI.Sprite(texture)

  img.x = app.renderer.width / 2
  img.y = app.renderer.height / 2
  img.anchor.x = 0.5
  img.anchor.y = 0.5

  app.stage.addChild(img)
  app.ticker.add(animate)

  function animate () {
    img.rotation += 0.01
  }
}

function handleLoad() {}
function handleProgress(loader, resouce) {
  console.log(loader.progress + '% loaded')
}

function handleError(err) {

}

document.body.appendChild(canvas)
