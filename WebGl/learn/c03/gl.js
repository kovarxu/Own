let mc = getMainCanvas()
let gl = createWebGlContext(mc)

let vts = createShader(gl, gl.VERTEX_SHADER, vt_shader)
let fms = createShader(gl, gl.FRAGMENT_SHADER, fm_shader)

let program = createProgram(gl, vts, fms)

// found attribute and uniform
let positionAttributeLocation = gl.getAttribLocation(program, 'a_position')
let resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution')
let matcontrolUniformLocation = gl.getUniformLocation(program, 'u_matcontrol')

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
let pr

function main () {
  // set uniform veriables
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

  // set uniforms
  let width = gl.canvas.width, height = gl.canvas.height
  gl.uniform2f(resolutionUniformLocation, width, height)
  changeM(pr)
  gl.uniformMatrix3fv(matcontrolUniformLocation, false, pr.m)

  // render
  let primitiveType = gl.TRIANGLES
  let offset = 0, count = 18
  gl.drawArrays(primitiveType, offset, count)
}

function setUniforms () {
  pr = {tx: 0, ty: 0, rot: 0, sx: 100, sy: 100}
  Object.defineProperty(pr, 'm', { writable: true, value: {} })
  initRangeWidget('tx', 'ty', 'rot', 'sx', 'sy', pr)
  observe(pr, render)
}

function resizeCanvas () {
  let cw = mc.width, ch = mc.height, sw = mc.clientWidth, sh = mc.clientHeight
  if (cw !== sw) mc.width = sw
  if (ch !== sh) mc.height = sh
}

function changeM (pr) {
  let sita = toRad(Number(pr.rot)), c = Math.cos(sita), s = Math.sin(sita)
  let tx = Number(pr.tx), ty = Number(pr.ty), sx = Number(pr.sx) / 100, sy = Number(pr.sy) / 100
  let transition = [
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
  pr.m = m3mul( transition, rotation, scale )
}

function clear () {
  gl.clearColor(0, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
}

main()
