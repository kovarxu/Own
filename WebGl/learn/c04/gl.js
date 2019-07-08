let mc = getMainCanvas()
let gl = createWebGlContext(mc)

let vts = createShader(gl, gl.VERTEX_SHADER, vt_shader)
let fms = createShader(gl, gl.FRAGMENT_SHADER, fm_shader)

let program = createProgram(gl, vts, fms)

// found attribute and uniform
let positionAttributeLocation = gl.getAttribLocation(program, 'a_position')
// unifiorm attribute u_matrix
let matrixUniformLocation = gl.getUniformLocation(program, 'u_matrix')

// create and bind buffer
let positionBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
// buffer data
let positions = [
  0, 0,
  30, 0,
  0, 150,
  0, 150,
  30, 0,
  30, 150,

  // top rung
  30, 0,
  100, 0,
  30, 30,
  30, 30,
  100, 0,
  100, 30,

  // middle rung
  30, 60,
  67, 60,
  30, 90,
  30, 90,
  67, 60,
  67, 90
]
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

// create and bind vao
let vao = gl.createVertexArray()
gl.bindVertexArray(vao)

// activate attribute
gl.enableVertexAttribArray(positionAttributeLocation)
// bind the current ARRAY_BUFFER to attribute
let size = 2, type = gl.FLOAT, normalize = false, stride = 0, offset = 0
gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset)

// transform matrix data
let pr = Object.create(null)

function main () {
  // set uniform veriables
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

  gl.useProgram(program)
  // bind the attribute/buffer we set
  gl.bindVertexArray(vao)

  // run n times
  let identity = m3unit()

  // coordinate projection
  let width = gl.canvas.width, height = gl.canvas.height
  let projection = [
    2 / width, 0, 0,
    0, -2 / height, 0,
    -1, 1, 1
  ]

  for (let i = 0; i < 5; i++) {
    changeM(pr, identity)
    gl.uniformMatrix3fv(matrixUniformLocation, false, m3mul(identity, projection))

    // render
    let primitiveType = gl.TRIANGLES
    let offset = 0, count = 18
    gl.drawArrays(primitiveType, offset, count)
  }
}

function initMatrix () {
  pr.tx = 141
  pr.ty = 83
  pr.rot = 0
  pr.sx = 78
  pr.sy = 70
  Object.defineProperty(pr, 'm', { writable: true, value: {} })
}

function setUniforms () { 
  initRangeWidget('tx', 'ty', 'rot', 'sx', 'sy', pr)
  observe(pr, render)
}

function resizeCanvas () {
  let cw = mc.width, ch = mc.height, sw = mc.clientWidth, sh = mc.clientHeight
  if (cw !== sw) mc.width = sw
  if (ch !== sh) mc.height = sh
}

function changeM (pr, base) {
  // set rotation orientation to clockwise
  let sita = toRad(360 - Number(pr.rot)), c = Math.cos(sita), s = Math.sin(sita)
  let tx = Number(pr.tx), ty = Number(pr.ty), sx = Number(pr.sx) / 100, sy = Number(pr.sy) / 100
  let translation = [
    1, 0, 0,
    0, 1, 0,
    tx, ty, 1
  ],
  rotation = [
    c, -s, 0,
    s, c, 0,
    0, 0, 1
  ],
  scale = [
    sx, 0, 0,
    0, sy, 0,
    0, 0, 1
  ]
  if (!base || typeof base !== 'object' || !base.length) {
    pr.m = m3mul( scale, rotation, translation )
  } else {
    let idk = m3mul( base, scale, rotation, translation )
    for (let i = 0; i < base.length; i++) base[i] = idk[i]
  }
}

function clear () {
  gl.clearColor(0, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
}

main()
