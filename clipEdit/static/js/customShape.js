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

Shape.strokePath = function (points) {
  points.forEach(item => {
    ctx.lineTo(item[0], item[1]);
  })
}

const arrow = new Shape([[0, 0], [200, 0], [160, -20], [300, 10], [160, 40], [200, 20], [0, 20]]);

arrow.draw = function (x, y) {
  ctx.save();
    ctx.setTransform(this.sx, 0, 0, this.sy, x, y);
    ctx.rotate(this.rotate);
    ctx.beginPath();
      Shape.strokePath(this.points);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
  ctx.restore();
}

setTimeout(() => {
  arrow.setRotate(.5);
  arrow.setScale(2.0);
  arrow.draw(100, 100);
}, 1000)

