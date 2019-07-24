let mc = getMainCanvas()
let gl = createWebGlContext(mc)

const programInfo = twgl.createProgramInfo(gl, [vt_shader, fm_shader]);

const positionCoords = [
  // left column front (clocewise)
  0,   0,  0,
  0, 150,  0,
  30,   0,  0,
  0, 150,  0,
  30, 150,  0,
  30,   0,  0,
  
  // top rung front (clockwise)
    30,   0,  0,
    30,  30,  0,
  100,   0,  0,
    
    30,  30,  0,
  100,  30,  0,
  100,   0,  0,

  // middle rung front
    30,  60,  0,
    30,  90,  0,
    67,  60,  0,
    30,  90,  0,
    67,  90,  0,
    67,  60,  0,

  // left column back
    0,   0,  30,
    30,   0,  30,
    0, 150,  30,
    0, 150,  30,
    30,   0,  30,
    30, 150,  30,

  // top rung back
    30,   0,  30,
  100,   0,  30,
    30,  30,  30,
    30,  30,  30,
  100,   0,  30,
  100,  30,  30,

  // middle rung back
    30,  60,  30,
    67,  60,  30,
    30,  90,  30,
    30,  90,  30,
    67,  60,  30,
    67,  90,  30,

  // top
    0,   0,   0,
  100,   0,   0,
  100,   0,  30,
    0,   0,   0,
  100,   0,  30,
    0,   0,  30,

  // top rung right
  100,   0,   0,
  100,  30,   0,
  100,  30,  30,
  100,   0,   0,
  100,  30,  30,
  100,   0,  30,

  // under top rung
  30,   30,   0,
  30,   30,  30,
  100,  30,  30,
  30,   30,   0,
  100,  30,  30,
  100,  30,   0,

  // between top rung and middle
  30,   30,   0,
  30,   60,  30,
  30,   30,  30,
  30,   30,   0,
  30,   60,   0,
  30,   60,  30,

  // top of middle rung
  30,   60,   0,
  67,   60,  30,
  30,   60,  30,
  30,   60,   0,
  67,   60,   0,
  67,   60,  30,

  // right of middle rung
  67,   60,   0,
  67,   90,  30,
  67,   60,  30,
  67,   60,   0,
  67,   90,   0,
  67,   90,  30,

  // bottom of middle rung.
  30,   90,   0,
  30,   90,  30,
  67,   90,  30,
  30,   90,   0,
  67,   90,  30,
  67,   90,   0,

  // right of bottom
  30,   90,   0,
  30,  150,  30,
  30,   90,  30,
  30,   90,   0,
  30,  150,   0,
  30,  150,  30,

  // bottom
  0,   150,   0,
  0,   150,  30,
  30,  150,  30,
  0,   150,   0,
  30,  150,  30,
  30,  150,   0,

  // left side
  0,   0,   0,
  0,   0,  30,
  0, 150,  30,
  0,   0,   0,
  0, 150,  30,
  0, 150,   0,
]

const normalCoords = [
  // left column front
  0, 0, 1,
  0, 0, 1,
  0, 0, 1,
  0, 0, 1,
  0, 0, 1,
  0, 0, 1,

  // top rung front
  0, 0, 1,
  0, 0, 1,
  0, 0, 1,
  0, 0, 1,
  0, 0, 1,
  0, 0, 1,

  // middle rung front
  0, 0, 1,
  0, 0, 1,
  0, 0, 1,
  0, 0, 1,
  0, 0, 1,
  0, 0, 1,

  // left column back
  0, 0, -1,
  0, 0, -1,
  0, 0, -1,
  0, 0, -1,
  0, 0, -1,
  0, 0, -1,

  // top rung back
  0, 0, -1,
  0, 0, -1,
  0, 0, -1,
  0, 0, -1,
  0, 0, -1,
  0, 0, -1,

  // middle rung back
  0, 0, -1,
  0, 0, -1,
  0, 0, -1,
  0, 0, -1,
  0, 0, -1,
  0, 0, -1,

  // top
  0, 1, 0,
  0, 1, 0,
  0, 1, 0,
  0, 1, 0,
  0, 1, 0,
  0, 1, 0,

  // top rung right
  1, 0, 0,
  1, 0, 0,
  1, 0, 0,
  1, 0, 0,
  1, 0, 0,
  1, 0, 0,

  // under top rung
  0, -1, 0,
  0, -1, 0,
  0, -1, 0,
  0, -1, 0,
  0, -1, 0,
  0, -1, 0,

  // between top rung and middle
  1, 0, 0,
  1, 0, 0,
  1, 0, 0,
  1, 0, 0,
  1, 0, 0,
  1, 0, 0,

  // top of middle rung
  0, 1, 0,
  0, 1, 0,
  0, 1, 0,
  0, 1, 0,
  0, 1, 0,
  0, 1, 0,

  // right of middle rung
  1, 0, 0,
  1, 0, 0,
  1, 0, 0,
  1, 0, 0,
  1, 0, 0,
  1, 0, 0,

  // bottom of middle rung.
  0, -1, 0,
  0, -1, 0,
  0, -1, 0,
  0, -1, 0,
  0, -1, 0,
  0, -1, 0,

  // right of bottom
  1, 0, 0,
  1, 0, 0,
  1, 0, 0,
  1, 0, 0,
  1, 0, 0,
  1, 0, 0,

  // bottom
  0, -1, 0,
  0, -1, 0,
  0, -1, 0,
  0, -1, 0,
  0, -1, 0,
  0, -1, 0,

  // left side
  -1, 0, 0,
  -1, 0, 0,
  -1, 0, 0,
  -1, 0, 0,
  -1, 0, 0,
  -1, 0, 0,
]

twgl.setAttributePrefix("a_")

const arrays = {
  position: positionCoords,
  normal: normalCoords
}

const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays)

const vao = twgl.createVAOFromBufferInfo(gl, programInfo, bufferInfo)

// transform matrix data
let pr = Object.create(null)
const reversedLightDirection = m3.normalize(m3unit(), [0.5, 0.7, 1.0])
const surfaceLight = m3.normalize(m4unit(), [210, 70, 110])

function main () {
  // set uniform variables
  initMatrix()
  setUniforms()
  render()
}

function render () {
  // make inner size the same as css size 
  resizeCanvas()

  // init window
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
  clear(gl)

  // see only clockwise triangles
  gl.enable(gl.CULL_FACE)

  // depth test
  gl.enable(gl.DEPTH_TEST)

  gl.useProgram(program)
  // bind the attribute/buffer we set
  gl.bindVertexArray(vao)

  changeM(pr)
  // gl.uniformMatrix4fv(matrixUniformLocation, false, m4mul(pr.m))
  twgl.setUniforms(programInfo, {
    u_matrix: pr.m,
    u_reversedLightDirection: reversedLightDirection,
    u_surfaceColor: surfaceLight
  })

  // render
  twgl.drawBufferInfo(gl, bufferInfo)
}

function initMatrix () {
  pr.pov = 100
  pr.tx = -150
  pr.ty = 0
  pr.tz = -360
  pr.rotx = 180
  pr.roty = 0
  pr.rotz = 0
  pr.sx = 100
  pr.sy = 100
  pr.sz = 100
  Object.defineProperty(pr, 'm', { writable: true, value: {} })
}

function setUniforms () { 
  initRangeWidget('pov', 'tx', 'ty', 'tz', 'rotx', 'roty', 'rotz', pr)
  observe(pr, render)
}

function resizeCanvas () {
  let cw = mc.width, ch = mc.height, sw = mc.clientWidth, sh = mc.clientHeight
  if (cw !== sw) mc.width = sw
  if (ch !== sh) mc.height = sh
}

function changeM (pr, base) {
  let sitaX = toRad(Number(pr.rotx)), c1 = Math.cos(sitaX), s1 = Math.sin(sitaX),
      sitaY = toRad(Number(pr.roty)), c2 = Math.cos(sitaY), s2 = Math.sin(sitaY),
      sitaZ = toRad(Number(pr.rotz)), c3 = Math.cos(sitaZ), s3 = Math.sin(sitaZ)
  let tx = Number(pr.tx), ty = Number(pr.ty), tz = Number(pr.tz), pov = Number(pr.pov) / 100,
      sx = Number(pr.sx) / 100, sy = Number(pr.sy) / 100, sz = Number(pr.sz) / 100
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
  // coordinate projection
  let left = 0, right = gl.canvas.clientWidth, bottom = gl.canvas.clientHeight, top = 0, near = 400, far = 0
  let projection = []
  m4.ortho(projection, left, right, bottom, top, near, far)

  // perspective conversion
  let aspect = right / bottom, perspective = []
  m4.perspective(perspective, pov, aspect, 1, 2000)

  if (!base || typeof base !== 'object' || !base.length) {
    pr.m = m4mul( scale, rotationZ, rotationY, rotationX, translation, perspective )
  } else {
    let idk = m4mul( base, scale, rotationZ, rotationY, rotationX, translation, projection, perspective )
    for (let i = 0; i < base.length; i++) base[i] = idk[i]
  }
}

function clear () {
  gl.clearColor(0, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
}

main()
