const WIDTHPIX = 600
const HEIGHTPIX = 400

function createCanvasAndWebgl2Context () {
  let canvas = document.createElement('canvas')
  canvas.width = WIDTHPIX
  canvas.height = HEIGHTPIX

  let gl = canvas.getContext('webgl2')

  if (!gl) {
    console.log('您的浏览器不支持webgl2')
    return
  }

  document.body.appendChild(canvas)

  return gl
}

function getVertexShaderSource () {
  // webgl2 需要始终在首行加上版本声明
  return `#version 300 es
  // 外部传入的attibution
  in vec3 a_position;
  in vec3 a_color;
  // 外部的变换矩阵
  uniform mat4 u_matrix;
  // 将颜色数据传给片元着色器
  out vec4 v_color;

  void main () {
    gl_Position = u_matrix * vec4(a_position, 1.0);
    v_color = vec4(a_color, 1.0);
  }
  `
}

function getFragmentShaderSource () {
  return `#version 300 es
  // 浮点数精度设定，高精度需要消耗更多性能
  precision mediump float;
  in vec4 v_color;
  out vec4 outColor;
  void main () {
    outColor = v_color;
  }
  `
}

function createShader (gl, type, source) {
  // 创建着色器，需要指定类型
  let shader = gl.createShader(type)
  // 传入着色器代码
  gl.shaderSource(shader, source)
  // 编译着色器代码
  gl.compileShader(shader)
  // 获取编译状态
  let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)

  if (success) {
    return shader
  }

  console.log(gl.getShaderInfoLog(shader))
  gl.deleteShader(shader)
  return null
}

function createProgram (gl, vertexShader, fragmentShader) {
  let program = gl.createProgram()
  // 为程序附加着色器
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  // 连接程序
  gl.linkProgram(program)
  // 获取连接状态
  let success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }
 
  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
  return null
}

function createDataBuffer (gl, property, type) {
  // 创建数据Buffer
  let positionBuffer = gl.createBuffer()
  // 绑定Buffer
  gl.bindBuffer(type, positionBuffer)
  // 将数据放入Buffer内
  gl.bufferData(type, property, gl.STATIC_DRAW)
}

function createAndBindVAO (gl) {
  let vao = gl.createVertexArray()
  gl.bindVertexArray(vao)
  return vao
}

function setAttribPointer (gl, program, attrname, size) {
  let positionAttributeLocation = gl.getAttribLocation(program, attrname)
  gl.enableVertexAttribArray(positionAttributeLocation)
  
  let type = gl.FLOAT
  let normalize = false
  let stride = 0
  let offset = 0
  gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset)
}

function setCubePointsBuffer (gl) {
  let positions = new Float32Array([
    // 顶点坐标
    0, 0, 0, 
    100, 0, 0, 
    100, 100, 0,
    0, 100, 0,
    0, 0, 100, 
    100, 0, 100, 
    100, 100, 100,
    0, 100, 100
  ])
  let type = gl.ARRAY_BUFFER
  createDataBuffer(gl, positions, type)
}

function setCubePointsPosBuffer (gl) {
  let positions = new Uint16Array([
    // 前面
    0, 1, 2,
    2, 3, 0,
    // 右面
    2, 1, 5,
    2, 5, 6,
    // 上面
    7, 3, 2,
    7, 2, 6,
    // 左面
    3, 4, 0,
    3, 7, 4,
    // 下面
    4, 1, 0,
    4, 5, 1,
    // 后面
    7, 5, 4,
    7, 6, 5
  ])
  let type = gl.ELEMENT_ARRAY_BUFFER
  createDataBuffer(gl, positions, type)
}

function setCubeColorsBuffer (gl) {
  const colors = new Float32Array([// 前面
    0.8, 0, 0,
    0.8, 0, 0,  
    0.8, 0, 0,
    0.8, 0, 0,
    0, 0.82, 0,
    0, 0.82, 0,
    0, 0.82, 0,
    0, 0.82, 0,
    0, 0, 0.79,
    0, 0, 0.79,
    0, 0, 0.79,
    0, 0, 0.79,
    0.2, 0.6, 1.0,
    0.2, 0.6, 1.0,
    0.2, 0.6, 1.0,
    0.2, 0.6, 1.0,
    0.6, 0.2, 0.88,
    0.6, 0.2, 0.88,
    0.6, 0.2, 0.88,
    0.6, 0.2, 0.88,
    0.9, 0.3, 0.2,
    0.9, 0.3, 0.2,
    0.9, 0.3, 0.2,
    0.9, 0.3, 0.2
  ])
  let type = gl.ARRAY_BUFFER
  createDataBuffer(gl, colors, type)
}

function setCubeColorsPosBuffer (gl) {
  let positions = new Uint16Array([
    // 前面
    0, 1, 2,
    2, 3, 0,
    // 右面
    2, 1, 5,
    2, 5, 6,
    // 上面
    7, 3, 2,
    7, 2, 6,
    // 左面
    3, 4, 0,
    3, 7, 4,
    // 下面
    4, 1, 0,
    4, 5, 1,
    // 后面
    7, 5, 4,
    7, 6, 5
  ])
  let type = gl.ELEMENT_ARRAY_BUFFER
  createDataBuffer(gl, positions, type)
}

function setCubePointsPosition (gl, program) {
  let attrname = 'a_position'
  let size = 3
  setCubePointsBuffer(gl)
  setCubePointsPosBuffer(gl)
  setAttribPointer(gl, program, attrname, size)
}

function setCubePointsColor (gl, program) {
  let attrname = 'a_color'
  let size = 3
  setCubeColorsBuffer(gl)
  // setCubeColorsPosBuffer(gl)
  setAttribPointer(gl, program, attrname, size)
}

function draw (gl, program, vao, context) {
  gl.viewport(0, 0, WIDTHPIX, HEIGHTPIX)
  // 清空屏幕
  gl.clearColor(0, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT)

  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);

  gl.useProgram(program)
  gl.bindVertexArray(vao)

  // 设置uniform属性值
  setUniforms(gl, program, context)

  let primitiveType = gl.TRIANGLES // 画三角形
  let offset = 0 // 偏移量
  let count = 36 // 点的数量
  // gl.drawArrays(primitiveType, offset, count)
  gl.drawElements(primitiveType, count, gl.UNSIGNED_SHORT, offset)
}

function setUniforms (gl, program, context) {
  let matrixUniformPosition = gl.getUniformLocation(program, 'u_matrix')
  let transformMatrix = getTransformMatrix(context)
  const orthoMatrix = ortho()
  gl.uniformMatrix4fv(matrixUniformPosition, false, m4mul(transformMatrix, orthoMatrix))
}

function ortho () {
  let ratio = 1.5
  let uni = m4unit()
  // 左右下上近远
  m4.ortho(uni, -WIDTHPIX/ratio, WIDTHPIX/ratio, -HEIGHTPIX/ratio, HEIGHTPIX/ratio, -300, 300)
  return uni
}

function getTransformMatrix (pr) {
  // set rotation orientation to clockwise
  let sitaX = toRad(Number(pr.rotx)), c1 = Math.cos(sitaX), s1 = Math.sin(sitaX),
      sitaY = toRad(Number(pr.roty)), c2 = Math.cos(sitaY), s2 = Math.sin(sitaY),
      sitaZ = toRad(Number(pr.rotz)), c3 = Math.cos(sitaZ), s3 = Math.sin(sitaZ)
  let tx = Number(pr.tx), ty = Number(pr.ty), tz = Number(pr.tz)
      sx = Number(pr.sx) / 100 || 1, sy = Number(pr.sy) / 100 || 1, sz = Number(pr.sz) / 100 || 1
  let translation = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    tx, ty, tz, 1
  ],
  rotationX = [
    1, 0, 0, 0,
    0, c1, s1, 0,
    0, -s1, c1, 0,
    0, 0, 0, 1
  ],
  rotationY = [
    c2, 0, -s2, 0,
    0, 1, 0, 0,
    s2, 0, c2, 0,
    0, 0, 0, 1
  ],
  rotationZ = [
    c3, s3, 0, 0,
    -s3, c3, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ],
  scale = [
    sx, 0, 0, 0,
    0, sy, 0, 0,
    0, 0, sz, 0,
    0, 0, 0, 1
  ]
  return m4mul( scale, rotationZ, rotationY, rotationX, translation )
}

function initGUI (context, cb) {
  const gui = new dat.GUI()
  // gui.domElement = document.querySelector('#control-box')
  let rotx = gui.add(context, 'rotx', -180, 180)
  let roty = gui.add(context, 'roty', -180, 180)
  let rotz = gui.add(context, 'rotz', -180, 180)
  let tx = gui.add(context, 'tx', -200, 400)
  let ty = gui.add(context, 'ty', -200, 200)
  let tz = gui.add(context, 'tz', -200, 100)
  let elements = [rotx, roty, rotz, tx, ty, tz]
  elements.forEach(item => item.onChange(cb))
}

window.onload = function main () {
  const gl = createCanvasAndWebgl2Context()
  if (!gl) return

  const vertexShaderSource = getVertexShaderSource()
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
  const fragmentShaderSource = getFragmentShaderSource()
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)

  if (!vertexShader || !fragmentShader) return
  const program = createProgram(gl, vertexShader, fragmentShader)

  let vao = createAndBindVAO(gl)
  setCubePointsPosition(gl, program)
  setCubePointsColor(gl, program)

  const context = { rotx: 20, roty: 70, rotz: 0, tx: 0, ty: 0, tz: 0 }
  initGUI(context, () => draw(gl, program, vao, context))

  draw(gl, program, vao, context)
}
