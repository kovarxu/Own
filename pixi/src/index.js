import * as PIXI from 'pixi.js'
import * as PIXIFILTERS from 'pixi-filters'
// simple filter + shader example

const vshader = `
attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;
varying vec2 vTextureCoord;

void main() {
  gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
  vTextureCoord = aTextureCoord;
}
`

const fshader = `
varying vec2 vTextureCoord;
uniform sampler2D uSampler;

void main() {
  vec4 color = texture2D(uSampler, vTextureCoord);
  gl_FragColor = vec4(1.0, color.gba);
}
`

const uniform = {}

const canvas = document.createElement('canvas')

const app = new PIXI.Application({
  view: canvas,
  width: window.innerWidth,
  height: window.innerHeight
})

const textureWater = PIXI.Texture.from('http://127.0.0.1:5000/assets/water.jpg')
const water = new PIXI.Sprite(textureWater)

water.x = app.renderer.width / 2
water.y = app.renderer.height / 2
water.anchor.x = 0.5
water.anchor.y = 0.5
app.stage.addChild(water)


const texture = PIXI.Texture.from('http://127.0.0.1:5000/assets/eggHead.png')
const img = new PIXI.Sprite(texture)

img.x = app.renderer.width / 2
img.y = app.renderer.height / 2
img.anchor.x = 0.5
img.anchor.y = 0.5
// img.filters = [ new PIXI.Filter(vshader, fshader, uniform) ]
// img.filters= [ new PIXIFILTERS.AsciiFilter(10) ]
img.filters = [ new PIXI.filters.DisplacementFilter(water, 16) ]
console.log(img.filters)
console.log(app.renderer.screen.width, app.renderer.screen.height)
app.stage.addChild(img)
app.ticker.add(animate)

function animate () {
  img.rotation += 0.01
}

document.body.appendChild(canvas)
