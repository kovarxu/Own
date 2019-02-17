var canvas, ctx;
// canvas尺寸
var canvasWidth, canvasHeight;
// 绘制区域尺寸
var drawWidth, drawHeight;

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
  // 调节画布
  justifySize(canvasWidth, parseInt(canvasWidth * ratio));
  // 起绘点
  let startX = (canvasWidth - drawWidth) / 2;
  let startY = (canvasHeight - drawHeight) / 2;
  ctx.drawImage(imgObj, startX, startY, drawWidth, drawHeight);
}
