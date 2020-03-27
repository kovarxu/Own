// 加载纹理图像
function getEarthTexture2D(gl, callback) {
  return twgl.createTexture(gl, {
    target: gl.TEXTURE_2D,
    level: 0,
    width: 1,
    height: 1,
    internalFormat: gl.RGBA,
    type: gl.UNSIGNED_BYTE,
    color: [0.8, 0.6, 1, 1],
    src: 'http://localhost:8062/imgs/earth/0.jpg',
    min: gl.NEAREST,
    mag: gl.LINEAR,
    crossOrigin: 'anonymous'
  }, callback)
}
