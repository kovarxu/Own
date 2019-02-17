var canvas, ctx;
// canvas尺寸
var canvasWidth, canvasHeight;
// 绘制区域尺寸
var drawWidth, drawHeight;
// 离屏canvas
var offScreenCanvasList = [];

window.onload = function () {
  canvas = document.querySelector('#canvas');
  ctx = canvas.getContext('2d');
  canvas.ctx = ctx;

  justifySize(canvas.width, canvas.height);
}

function justifySize (w, h) {
  canvasWidth = w;
  canvasHeight = h;
  drawWidth = parseInt(canvasWidth * .9);
  drawHeight = parseInt(canvasHeight * .9);
  canvas.width = w;
  canvas.height = h;
}

function drawOnCanvas (imgObj) {
  let w = imgObj.naturalWidth, h = imgObj.naturalHeight, ratio = h / w;
  // 调节画布尺寸
  justifySize(canvasWidth, parseInt(canvasWidth * ratio));
  // 起绘点
  let startX = (canvasWidth - drawWidth) / 2;
  let startY = (canvasHeight - drawHeight) / 2;

  let newc = newCanvas(canvasWidth, canvasHeight, 'imgObjCanvas');
  newc.ctx.drawImage(imgObj, startX, startY, drawWidth, drawHeight);
  saveCanvas(newc, 1);
  rerender();
}

function rerender () {
  console.log(offScreenCanvasList);
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  for (let k of offScreenCanvasList) {
    ctx.drawImage(k, 0, 0);
  }
}

function newCanvas (w, h, n) {
  let newc = document.createElement('canvas');
  newc.width = w;
  newc.height = h;
  let newCtx = newc.getContext('2d');
  newc.ctx = newCtx;
  if (n) {
    newc.name = n;
  } else {
    throw new Error("no named offscreen canvas.");
  }
  return newc;
}

function getCanvas (name) {
  if (offScreenCanvasList.find(item => item.name === name)) {
    return item;
  } else {
    return null;
  }
}

function saveCanvas (canvas, prio) {
  if (canvas.name) {
    if (prio) {
      offScreenCanvasList.unshift(canvas);
    } else {
      offScreenCanvasList.push(canvas);
    }
  }
}

function removeCanvas (name) {
  var index = offScreenCanvasList.findIndex(item => item.name === name);
  if (index >= 0) {
    delete offScreenCanvasList[name];
  }
}

// Object.defineProperty(refreshFlag, 'do', {
//   set (val) {
//     if (val) {
//       rerender();
//     }
//   }
// })
