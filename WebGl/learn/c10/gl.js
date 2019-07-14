let mc = getMainCanvas()
let gl = createWebGlContext(mc)

let vts = createShader(gl, gl.VERTEX_SHADER, vt_shader)
let fms = createShader(gl, gl.FRAGMENT_SHADER, fm_shader)

let program = createProgram(gl, vts, fms)

// found attribute and uniform
let positionAttributeLocation = gl.getAttribLocation(program, 'a_position')
let colorAttributeLocation = gl.getAttribLocation(program, 'a_color')
// unifiorm attribute u_matrix
let matrixUniformLocation = gl.getUniformLocation(program, 'u_matrix')

// create and bind buffer
let positionBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
// buffer data
let positions = [
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
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

// create and bind vao
let vao = gl.createVertexArray()
gl.bindVertexArray(vao)

// activate point attribute
gl.enableVertexAttribArray(positionAttributeLocation)
// bind the current ARRAY_BUFFER to attribute
let size = 3, type = gl.FLOAT, normalize = false, stride = 0, offset = 0
gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset)

/* ----------- color attribute ---------- */

// activate color attribute
let colorBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
let colors = new Uint8Array([
  // left column front
  200,  70, 120,
  200,  70, 120,
  200,  70, 120,
  200,  70, 120,
  200,  70, 120,
  200,  70, 120,

    // top rung front
  200,  70, 120,
  200,  70, 120,
  200,  70, 120,
  200,  70, 120,
  200,  70, 120,
  200,  70, 120,

    // middle rung front
  200,  70, 120,
  200,  70, 120,
  200,  70, 120,
  200,  70, 120,
  200,  70, 120,
  200,  70, 120,

    // left column back
  80, 70, 200,
  80, 70, 200,
  80, 70, 200,
  80, 70, 200,
  80, 70, 200,
  80, 70, 200,

    // top rung back
  80, 70, 200,
  80, 70, 200,
  80, 70, 200,
  80, 70, 200,
  80, 70, 200,
  80, 70, 200,

    // middle rung back
  80, 70, 200,
  80, 70, 200,
  80, 70, 200,
  80, 70, 200,
  80, 70, 200,
  80, 70, 200,

    // top
  70, 200, 210,
  70, 200, 210,
  70, 200, 210,
  70, 200, 210,
  70, 200, 210,
  70, 200, 210,

    // top rung right
  200, 200, 70,
  200, 200, 70,
  200, 200, 70,
  200, 200, 70,
  200, 200, 70,
  200, 200, 70,

    // under top rung
  210, 100, 70,
  210, 100, 70,
  210, 100, 70,
  210, 100, 70,
  210, 100, 70,
  210, 100, 70,

    // between top rung and middle
  210, 160, 70,
  210, 160, 70,
  210, 160, 70,
  210, 160, 70,
  210, 160, 70,
  210, 160, 70,

    // top of middle rung
  70, 180, 210,
  70, 180, 210,
  70, 180, 210,
  70, 180, 210,
  70, 180, 210,
  70, 180, 210,

    // right of middle rung
  100, 70, 210,
  100, 70, 210,
  100, 70, 210,
  100, 70, 210,
  100, 70, 210,
  100, 70, 210,

    // bottom of middle rung.
  76, 210, 100,
  76, 210, 100,
  76, 210, 100,
  76, 210, 100,
  76, 210, 100,
  76, 210, 100,

    // right of bottom
  140, 210, 80,
  140, 210, 80,
  140, 210, 80,
  140, 210, 80,
  140, 210, 80,
  140, 210, 80,

    // bottom
  90, 130, 110,
  90, 130, 110,
  90, 130, 110,
  90, 130, 110,
  90, 130, 110,
  90, 130, 110,

    // left side
  160, 160, 220,
  160, 160, 220,
  160, 160, 220,
  160, 160, 220,
  160, 160, 220,
  160, 160, 220,
])
gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW)
gl.enableVertexAttribArray(colorAttributeLocation)
// the data is 8 bit unsigned byte(0 - 255)
size = 3, type = gl.UNSIGNED_BYTE, normalize = true, stride = 0, offset = 0
gl.vertexAttribPointer(colorAttributeLocation, size, type, normalize, stride, offset)

/* ----------- color attribute ---------- */

// transform matrix data
let pr = Object.create(null)

// animation global variables
let then = 0, currot = 0
const rotPerSecond = 90

function main () {
  // set uniform variables
  initMatrix()
  setUniforms()
  // draw first screen
  requestAnimationFrame(render)
}

function render (now) {
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

  drawObjectCircle(pr, now)

  // we call requestAnimationFrame again to keep on animating
  requestAnimationFrame(render)
}

function drawObjectCircle (pr, now) {
  let tx = Number(pr.tx), ty = Number(pr.ty), tz = Number(pr.tz), radius = Number(pr.radius)
  // inverse matrix of camera matrix
  let caPosition = [tx, ty, tz], center = [radius, 30, 0], up = [0, 1, 0]

  // be careful that this util handled invert by default, so we needn't do that by ourselves
  let caMatrix = m4.lookAt(m4unit(), caPosition, center, up)
  // no need this: let icaMatrix = m4.invert([], caMatrix)

  // perspective matrix
  let width = gl.canvas.clientWidth, height = gl.canvas.clientHeight, pov = Math.PI / 2
  let perspective = m4.perspective(m4unit(), pov, width / height, 1, 2000)

  /* ----------- animation ----------- */
  if (!then) then = now
  else {
    currot += (now - then) / 1000 * rotPerSecond
    then = now
  }
  /* ----------- animation ----------- */

  for (let i = 0; i < 6; i++) {
    let sita = 2 * Math.PI / 6 * i
    let x = radius * Math.cos(sita), z = radius * Math.sin(sita)
    let rotationX = m4rotateX(Math.PI)
    let rotationY = m4rotateY(toRad(currot))
    let translation = m4translate(x, 30, z)
    let matrix = m4mul(rotationX, rotationY, translation, caMatrix, perspective)
    gl.uniformMatrix4fv(matrixUniformLocation, false, matrix)

    // render
    let primitiveType = gl.TRIANGLES
    let offset = 0, count = 16 * 6
    gl.drawArrays(primitiveType, offset, count)
  }
}

function initMatrix () {
  pr.radius = 200
  pr.tx = 0
  pr.ty = 0
  pr.tz = 200
  Object.defineProperty(pr, 'm', { writable: true, value: {} })
}

function setUniforms () { 
  initRangeWidget('radius', 'tx', 'ty', 'tz', pr)
  observe(pr, [])
}

function resizeCanvas () {
  let cw = mc.width, ch = mc.height, sw = mc.clientWidth, sh = mc.clientHeight
  if (cw !== sw) mc.width = sw
  if (ch !== sh) mc.height = sh
}

function changeM (pr) {
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

  if (!pr.base || typeof pr.base !== 'object' || !pr.base.length) {
    pr.m = m4mul( scale, rotationZ, rotationY, rotationX, translation, perspective )
  } else {
    let idk = m4mul( pr.base, scale, rotationZ, rotationY, rotationX, translation, projection, perspective )
    for (let i = 0; i < pr.base.length; i++) pr.base[i] = idk[i]
  }
}

function clear () {
  gl.clearColor(0, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
}

main()
