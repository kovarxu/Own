import * as PIXI from 'pixi.js'
// first basic application demo

const canvas = document.createElement('canvas')

const app = new PIXI.Application({
  view: canvas,
  width: window.innerWidth,
  height: window.innerHeight
})

const texture = PIXI.Texture.from('http://127.0.0.1:5000/assets/eggHead.png')
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

document.body.appendChild(canvas)
