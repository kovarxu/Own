const WIDTHPIX = 900
const HEIGHTPIX = 600
const PORT = 8062

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
  in vec2 a_texcoord;
  in vec4 a_color;
  // 外部的变换矩阵
  uniform mat4 u_matrix;
  // 纹理信息
  out vec2 v_texcoord;

  void main () {
    gl_Position = u_matrix * vec4(a_position, 1.0);
    v_texcoord = a_texcoord;
  }
  `
}

function getFragmentShaderSource () {
  return `#version 300 es
  // 浮点数精度设定，高精度需要消耗更多性能
  precision mediump float;
  in vec2 v_texcoord;
  out vec4 outColor;
  // 纹理
  uniform sampler2D u_texture;

  void main () {
    outColor = texture(u_texture, v_texcoord);
  }
  `
}

function draw (gl, program, bufferInfo, vao) {
  gl.viewport(0, 0, WIDTHPIX, HEIGHTPIX)
  // 清空屏幕
  gl.clearColor(0, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT)

  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);

  gl.useProgram(program.program || program)
  gl.bindVertexArray(vao)

  let primitiveType = gl.TRIANGLES // 画三角形
  let offset = 0 // 偏移量
  // let count = 36 // 点的数量
  gl.drawArrays(primitiveType, offset, bufferInfo.numElements)
  // gl.drawElements(primitiveType, count, gl.UNSIGNED_SHORT, offset)
  // twgl.drawBufferInfo(gl, bufferInfo, primitiveType, count, offset)
}

function setUniforms (gl, programContext, context) {
  gl.useProgram(programContext.program)
  // let matrixUniformPosition = gl.getUniformLocation(program, 'u_matrix')
  const transformMatrix = getTransformMatrix(context)
  const orthoMatrix = ortho()
  // gl.uniformMatrix4fv(matrixUniformPosition, false, m4mul(transformMatrix, orthoMatrix))
  twgl.setUniforms(programContext, { 'u_matrix': m4.m4mul(transformMatrix, orthoMatrix) })
}

function ortho () {
  let ratio = 2
  // left, right, bottom, up, near, far
  return m4.ortho(-WIDTHPIX/ratio, WIDTHPIX/ratio, -HEIGHTPIX/ratio, HEIGHTPIX/ratio, -300, 300)
}

function getTransformMatrix (pr) {
  // set rotation orientation to clockwise
  let translation = m4.m4translate(pr.tx, pr.ty, pr.tz),
      rotationX = m4.m4rotateX(toRad(+pr.rotx)),
      rotationY = m4.m4rotateY(toRad(+pr.roty)),
      rotationZ = m4.m4rotateZ(toRad(+pr.rotz)),
      scale = m4.m4scale(+pr.sx/100, +pr.sy/100, +pr.sz/100)

  return m4.m4mul( scale, rotationZ, rotationY, rotationX, translation )
}

function getTexture (gl, callback) {
  return twgl.createTexture(gl, {
    target: gl.TEXTURE_2D,
    level: 0,
    width: 1,
    height: 1,
    internalFormat: gl.RGBA,
    type: gl.UNSIGNED_BYTE,
    color: [0.8, 0.6, 1, 1],
    src: 'http://localhost:8062/imgs/tx_bet.png',
    crossOrigin: 'anonymous'
  }, callback)
}

function setTextureCoord (gl, vertices) {
  const textureCoord = new Float32Array([
    0, 0, 0, 0.5, 0.25, 0.5, 0.25, 0, // A
    0.5, 0.5, 0.5, 0, 0.25, 0, 0.25, 0.5, // B
    0.5, 0.5, 0.75, 0.5, 0.75, 0, 0.5, 0,  // C
    0.25, 0.5, 0, 0.5, 0, 1, 0.25, 1, // D
    0.25, 0.5, 0.25, 1, 0.5, 1, 0.5, 0.5, // E
    0.5, 0.5, 0.5, 1, 0.75, 1, 0.75, 0.5 // F
  ])

  let texcoord = vertices.texcoord
  for (let i = 0; i < texcoord.length; i++) {
    texcoord[i] = textureCoord[i]
  }
  return vertices
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
  if (!twgl || !flattenedPrimitives) {
    console.log('enhanced twgl start failed, program automatically exit')
    return
  }
  const gl = createCanvasAndWebgl2Context()
  if (!gl) return

  const vertexShaderSource = getVertexShaderSource()
  const fragmentShaderSource = getFragmentShaderSource()
  const programContext = twgl.createProgramInfo(gl, [vertexShaderSource, fragmentShaderSource])

  twgl.setAttributePrefix('a_')
  twgl.setRandColorFn('complete_random')
  const cubeBufferVertices = twgl.primitives.createCubeVertices(200)
  const cubeBufferInfo = twgl.createFlattenedVertices(gl, cubeBufferVertices, 6, setTextureCoord)
  const vao = twgl.createVAOFromBufferInfo(gl, programContext, cubeBufferInfo)
  let texture = getTexture(gl, rerender)

  const context = { rotx: 20, roty: 70, rotz: 0, tx: 0, ty: 0, tz: 0 }

  rerender()

  initGUI(context, rerender)

  function rerender () {
    setUniforms(gl, programContext, context)
    draw(gl, programContext, cubeBufferInfo, vao)
  }
}
