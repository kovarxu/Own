// 预定义一些形状

class Shape {
  constructor (points) {
    // 缩放系数
    this.sx = 1.0;
    this.sy = 1.0;
    this.rotate = 0;
    this.color = 'red';
    this.points = points;
  }

  setRotate (r) {
    this.rotate = r;
  }
  
  setScale (sx, sy) {
    if (sx) this.sx = sx;
    if (sy) this.sy = sy;
  }

  setColor (c) {
    this.color = c;
  }

  draw (x, y) {
    throw "no draw function specified."
  }
}

Shape.strokePath = function (ctx, points) {
  points.forEach(item => {
    ctx.lineTo(item[0], item[1]);
  })
}

class Arrow extends Shape {
  constructor () {
    super([[0, -10], [200, -10], [160, -30], [300, 0], [160, 30], [200, 10], [0, 10]]);
  }
  
  draw (x, y) {
    // 先获取canvas
    let shapeCanvas = getCanvas('shapeCanvas');
    if (! shapeCanvas) {
      shapeCanvas = newCanvas(canvasWidth, canvasHeight, 'shapeCanvas');
      saveCanvas(shapeCanvas);
    }
    let shapeCtx = shapeCanvas.ctx;

    shapeCtx.save();
    // 注意这三个的顺序
    shapeCtx.translate(x, y);
    shapeCtx.rotate(this.rotate);
    shapeCtx.scale(this.sx, this.sy);
      shapeCtx.beginPath();
        Shape.strokePath(shapeCtx, this.points);
      shapeCtx.closePath();
      shapeCtx.fillStyle = this.color;
      shapeCtx.fill();
    shapeCtx.restore();
    rerender();
  }
}


