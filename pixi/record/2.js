import * as PIXI from 'pixi.js'
// something about the three basic concepts: renderer, stage and ticker

const canvas = document.createElement('canvas')

let _w = window.innerWidth, _h = window.innerHeight

const renderer = new PIXI.Renderer({
  view: canvas,
  width: _w,
  height: _h,
  resolution: window.devicePixelRatio,
  autoDensity: true
})

window.addEventListener('resize', handleResize, false)

function handleResize () {
  _w = window.innerWidth
  _h = window.innerHeight
  renderer.resize(_w, _h)
}

const stage = new PIXI.Container()
const ticker = new PIXI.Ticker()

const texture = PIXI.Texture.from('http://127.0.0.1:5000/assets/eggHead.png')
const img = new PIXI.Sprite(texture)

img.x = renderer.screen.width / 2 // use screen to eliminate diffences between retina and non-retina screens
img.y = renderer.screen.height / 2
img.anchor.x = 0.5
img.anchor.y = 0.5

stage.addChild(img)
ticker.add(animate)
ticker.start()

function animate () {
  img.x = renderer.screen.width / 2
  img.y = renderer.screen.height / 2

  img.rotation += 0.01
  if (img.rotation > 2) {
    ticker.stop()
  }

  renderer.render(stage)
}

document.body.appendChild(canvas)
