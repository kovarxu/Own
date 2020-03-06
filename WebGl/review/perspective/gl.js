const WIDTHPIX = 900
const HEIGHTPIX = 600
const ROT_SPEED = 50
const VIBRATE_SPEED = 200
const sin = Math.sin
const PI = Math.PI
const globalContext = { eye_x: -700, eye_y: 1277, eye_z: -24, target_x: 270, target_y: -155, target_z: 236, pov: 106 }
let preTimer = 0, startTimer = 0

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
  in vec4 a_color;
  // 外部的变换矩阵
  uniform mat4 u_matrix;
  // 将颜色数据传给片元着色器
  out vec4 v_color;

  void main () {
    gl_Position = u_matrix * vec4(a_position, 1.0);
    v_color = a_color;
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

function prepareDraw (gl, program, vao) {
  gl.viewport(0, 0, WIDTHPIX, HEIGHTPIX)
  // 清空屏幕
  gl.clearColor(0, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT)

  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);

  gl.useProgram(program.program || program)
  gl.bindVertexArray(vao)
}

function draw (gl, programContext, bufferInfo, context) {
  setUniforms(programContext, context)

  let primitiveType = gl.TRIANGLES // 画三角形
  let offset = 0 // 偏移量
  // let count = 36 // 点的数量
  // gl.drawArrays(primitiveType, offset, bufferInfo.numElements)
  // gl.drawElements(primitiveType, count, gl.UNSIGNED_SHORT, offset)
  twgl.drawBufferInfo(gl, bufferInfo, primitiveType, bufferInfo.numElements, offset)
}

function setUniforms (programContext, context) {
  const transformMatrix = getTransformMatrix(context)
  const perspectiveMatrix = perspective(globalContext)
  const orthoMatrix = ortho()
  const cameraMatrix = camera(globalContext)
  twgl.setUniforms(programContext, { 'u_matrix': m4.m4mul(transformMatrix, cameraMatrix, perspectiveMatrix) })
}

function camera (context) {
  let eye = [context.eye_x, context.eye_y, context.eye_z]
  let target = [context.target_x, context.target_y, context.target_z]
  let up = [1, 0, 0]
  let lookat = m4.lookAt(eye, target, up)
  return m4.inverse(lookat)
}

function perspective (context) {
  let pov = toRad(context.pov || 135)
  let aspect = WIDTHPIX / HEIGHTPIX
  let near = 1
  let far = 5000
  // 这个方法可以直接把默认的左手坐标系变成右手坐标系
  return m4.perspective(pov, aspect, near, far)
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

function initGUI (context, cb) {
  const gui = new dat.GUI()
  let eye_x = gui.add(context, 'eye_x', -3000, 3000)
  let eye_y = gui.add(context, 'eye_y', -3000, 3000)
  let eye_z = gui.add(context, 'eye_z', -3000, 3000)
  let target_x = gui.add(context, 'target_x', -3000, 3000)
  let target_y = gui.add(context, 'target_y', -3000, 3000)
  let target_z = gui.add(context, 'target_z', -3000, 3000)
  let pov = gui.add(context, 'pov', 0, 180)
  let elements = [eye_x, eye_y, eye_z, target_x, target_y, target_z, pov]
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
  const cubeBufferInfo = flattenedPrimitives.createCubeBufferInfo(gl, 20)
  const vao = twgl.createVAOFromBufferInfo(gl, programContext, cubeBufferInfo)

  let motionObjects = initMotion()

  prepareDraw(gl, programContext, vao)
  for (let i = 0; i < motionObjects.length; i++) {
    let context = motionObjects[i].getContext()
    draw(gl, programContext, cubeBufferInfo, context)
  }

  requestAnimationFrame(rerender)

  function rerender (time) {
    tick(time, motionObjects)
    prepareDraw(gl, programContext, vao)
    for (let i = 0; i < motionObjects.length; i++) {
      let context = motionObjects[i].getContext()
      draw(gl, programContext, cubeBufferInfo, context)
    }
    requestAnimationFrame(rerender)
  }

  initGUI(globalContext, () => {})
}

function initMotion () {
  let mobjs = []
  let step = 50

  for (let j = -5; j < 6; j++) {
    let sz = 150 * j
    for (let i = 0; i < 80; i++) {
      let x = step * i - 1000
      let y = 100 * sin(PI / 300 * x)
      mobjs.push(new inMotionObject(x, y, -700 + sz, 20, 70, 0))
    }
  }
  
  return mobjs
}

function tick (time, mobjs) {
  if (!preTimer) {
    startTimer = preTimer = time
  } else {
    let deltaTime = time - preTimer
    let deltaRot = ROT_SPEED * deltaTime / 1000
    let runTime = time - startTimer
    let deltaX = VIBRATE_SPEED * runTime / 1000
    mobjs.forEach((item) => {
      item.tickChangeRot(deltaRot)
      item.tickChangeYBaseOnX(deltaX)
    })
    preTimer = time
  }
  return mobjs
}

class inMotionObject {
  constructor (x, y, z, rotx, roty, rotz) {
    this._context = {
      tx: x, ty: y, tz: z, rotx, roty, rotz
    }

    let randDirect = Math.random() * 3 | 0
    this.direction = randDirect === 2 ? 'z' : randDirect === 1 ? 'y' : 'x'
  }

  getContext () {
    return this._context
  }

  tickChangeRot (n) {
    let aname = 'rot' + this.direction
    this._context[aname] += n
  }

  tickChangeYBaseOnX (x) {
    let combinedx = this._context['tx'] + x
    this._context['ty'] = 100 * sin(PI / 300 * combinedx)
  }
}
