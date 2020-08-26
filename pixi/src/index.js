import * as PIXI from 'pixi.js'
import * as PIXIFILTERS from 'pixi-filters'
import WebGl2Renderer from './self-canvas';
import PCoreRenderer from './pixi-core-sample';

const canvas = document.createElement('canvas')

const app = new PIXI.Application({
  view: canvas,
  width: 500,
  height: 400,
  antialias: false,
  resolution: 1
})

const loader = PIXI.Loader.shared
loader.onComplete.add(handleAddComplete)
loader.onLoad.add(handleLoad)
loader.onProgress.add(handleProgress)
loader.onError.add(handleError)

loader.add('tex00', 'http://127.0.0.1:5000/assets/imgs/锤子动画_00000.png')
      .add('tex01', 'http://127.0.0.1:5000/assets/imgs/锤子动画_00001.png')
      .add('tex02', 'http://127.0.0.1:5000/assets/imgs/锤子动画_00002.png')
      .add('tex03', 'http://127.0.0.1:5000/assets/imgs/锤子动画_00003.png')
      .add('tex04', 'http://127.0.0.1:5000/assets/imgs/锤子动画_00004.png')
      .add('tex05', 'http://127.0.0.1:5000/assets/imgs/锤子动画_00005.png')
      .add('tex06', 'http://127.0.0.1:5000/assets/imgs/锤子动画_00006.png')
      .add('tex07', 'http://127.0.0.1:5000/assets/imgs/锤子动画_00007.png')
      .add('tex08', 'http://127.0.0.1:5000/assets/imgs/锤子动画_00008.png')
      .add('tex09', 'http://127.0.0.1:5000/assets/imgs/锤子动画_00009.png')
      .add('tex10', 'http://127.0.0.1:5000/assets/imgs/锤子动画_00010.png')
      .add('tex11', 'http://127.0.0.1:5000/assets/imgs/锤子动画_00011.png')
      .add('tex12', 'http://127.0.0.1:5000/assets/imgs/锤子动画_00012.png')
      .add('tex13', 'http://127.0.0.1:5000/assets/imgs/锤子动画_00013.png');
loader.load()

function handleAddComplete () {
  return 'handleAddComplete';
}
let i = 0;
function handleLoad () {
  if (++i < 14) return;
  const tex00 = loader.resources['tex00'].texture;
  const tex01 = loader.resources['tex01'].texture;
  const tex02 = loader.resources['tex02'].texture;
  const tex03 = loader.resources['tex03'].texture;
  const tex04 = loader.resources['tex04'].texture;
  const tex05 = loader.resources['tex05'].texture;
  const tex06 = loader.resources['tex06'].texture;
  const tex07 = loader.resources['tex07'].texture;
  const tex08 = loader.resources['tex08'].texture;
  const tex09 = loader.resources['tex09'].texture;
  const tex10 = loader.resources['tex10'].texture;
  const tex11 = loader.resources['tex11'].texture;
  const tex12 = loader.resources['tex12'].texture;
  const tex13 = loader.resources['tex13'].texture;
  const textures= [
    tex00,
    tex01,
    tex02,
    tex03,
    tex04,
    tex05,
    tex06,
    tex07,
    tex08,
    tex09,
    tex10,
    tex11,
    tex12,
    tex13,
  ]
  let currentTextureIndex = 0;
  let preTime = Date.now();
  const img = new PIXI.Sprite(textures[currentTextureIndex]);
  img.x = 0
  img.y = 0
  img.anchor.x = 0
  img.anchor.y = 0
  img.filters=[ new PIXI.filters.FXAAFilter() ]

  console.log('onload')

  app.stage.addChild(img)
  // app.ticker.add(animate)

  function animate () {
    const time = Date.now();
    if (time - preTime >= 16.67 * 5) {
      preTime = time;
      currentTextureIndex = currentTextureIndex < textures.length - 1 ? currentTextureIndex + 1 : 0;
      img.texture = textures[currentTextureIndex];
    }
  }
}
function handleProgress (img, number) {
  return 'handleProgress';
}
function handleError () {
  return 'handleError';
}

canvas.style.width = 250 + 'px';
canvas.style.height = 200 + 'px';

document.body.appendChild(canvas)

// another context 

function createCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = 500;
  canvas.height = 400;
  canvas.style.display = 'block';
  canvas.style.width = '250px';
  canvas.style.height = '200px';
  canvas.style.backgroundColor = 'black';
  return canvas;
}

{
  const canvas = createCanvas();
  const texture = new Image();
  texture.crossOrigin = 'anonymous';
  texture.src = 'http://127.0.0.1:5000/assets/imgs/锤子动画_00000.png';
  texture.onload = () => {
    const renderer = new WebGl2Renderer(canvas);
    renderer.render(texture);
    document.body.appendChild(canvas);
  }
}

// using gl-core
// {
//   const canvas = createCanvas();
//   const texture = new Image();
//   texture.crossOrigin = 'anonymous';
//   texture.src = 'http://127.0.0.1:5000/assets/imgs/锤子动画_00000.png';
//   texture.onload = () => {
//     const renderer = new PCoreRenderer(canvas);
//     renderer.render(texture);
//     document.body.appendChild(canvas);
//   }
// }
