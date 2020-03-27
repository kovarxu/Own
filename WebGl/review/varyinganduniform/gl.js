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
  in vec2 a_position;
  // 外部传入uniform分辨率
  uniform vec2 u_resolution;
  // 将颜色数据传给片元着色器
  out vec4 v_color;

  void main () {
    vec2 relative_position = a_position / u_resolution;
    vec2 comform_position = relative_position * 2.0 - 1.0;
    gl_Position = vec4(comform_position, 0, 1.0);
    v_color = vec4(fract(relative_position * 9.0), 1.0, 1.0);
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

function createDataBuffer (gl, program) {
  // 创建数据Buffer
  let positionBuffer = gl.createBuffer()
  // 绑定Buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  // 初始化顶点数据
  let positions = new Float32Array([50, 0, 50, 200, 150, 0])
  // 将数据放入Buffer内
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)
}

function createAndBindVAO (gl) {
  let vao = gl.createVertexArray()
  gl.bindVertexArray(vao)
  return vao
}

function setAttribPointer (gl, program) {
  let positionAttributeLocation = gl.getAttribLocation(program, 'a_position')
  gl.enableVertexAttribArray(positionAttributeLocation)
  
  let size = 2
  let type = gl.FLOAT
  let normalize = false
  let stride = 0
  let offset = 0
  gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset)
}

function draw (gl, program, vao) {
  gl.viewport(0, 0, WIDTHPIX, HEIGHTPIX)
  // 清空屏幕
  gl.clearColor(0, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT)

  gl.useProgram(program)
  gl.bindVertexArray(vao)

  // 设置uniform属性值
  setUniforms(gl, program)

  let primitiveType = gl.TRIANGLES // 画三角形
  let offset = 0 // 偏移量
  let count = 3 // 点的数量
  gl.drawArrays(primitiveType, offset, count)
}

function setUniforms (gl, program) {
  let resolutionUniformPosition = gl.getUniformLocation(program, 'u_resolution')
  gl.uniform2f(resolutionUniformPosition, WIDTHPIX, HEIGHTPIX)
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

  createDataBuffer(gl)
  const vao = createAndBindVAO(gl)
  setAttribPointer(gl, program)

  draw(gl, program, vao)
}
