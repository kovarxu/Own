import * as PIXI from 'pixi.js'
// sprite demo

const canvas = document.createElement('canvas')

const app = new PIXI.Application({
  view: canvas,
  width: window.innerWidth,
  height: window.innerHeight
})

const texture = PIXI.Texture.from('http://127.0.0.1:5000/assets/eggHead.png')
const img = new PIXI.Sprite(texture)

const grassTexture = PIXI.Texture.from('http://127.0.0.1:5000/assets/grass.jpeg')
const grass = new PIXI.Sprite(grassTexture)

img.position.set(app.renderer.screen.width / 2, app.renderer.screen.height / 2)
img.anchor.set(0.5)
img.pivot.set(100, 10)

app.stage.addChild(grass)
app.stage.addChild(img)
app.ticker.add(animate)

img.tint = 0x4c6e78
// img.mask = anotherTexture
img.blendMode = PIXI.BLEND_MODES.LIGHTEN
// img.visible = false
img.alpha = 0.7
img.interactive = true
img.buttonMode = true

grass.position.set(app.renderer.screen.width / 2, app.renderer.screen.height / 2)
grass.anchor.set(0.5)
grass.scale = new PIXI.Point(0.8, 0.8)

function animate () {
  img.rotation += 0.01
}

document.body.appendChild(canvas)
