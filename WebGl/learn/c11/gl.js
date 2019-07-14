let mc = getMainCanvas()
let gl = createWebGlContext(mc)

let vts = createShader(gl, gl.VERTEX_SHADER, vt_shader)
let fms = createShader(gl, gl.FRAGMENT_SHADER, fm_shader)

let program = createProgram(gl, vts, fms)

// found attribute and uniform
let positionAttributeLocation = gl.getAttribLocation(program, 'a_position')
let coordAttributeLocation = gl.getAttribLocation(program, 'a_textcoord')
// unifiorm attribute u_matrix
let matrixUniformLocation = gl.getUniformLocation(program, 'u_matrix')
let samplerUniformLocation = gl.getUniformLocation(program, 'u_texture')

// create and bind buffer
let positionBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
// buffer data
let positions = [
  0, 0, 0,
  0, 0, -100,
  100, 0, 0,
  0, 0, -100,
  100, 0, -100,
  100, 0, 0,

  0, 0, -100,
  0, 100, -100,
  100, 0, -100,
  0, 100, -100,
  100, 100, -100,
  100, 0, -100,

  100, 0, -100,
  100, 100, -100,
  100, 0, 0,
  100, 100, -100,
  100, 100, 0,
  100, 0, 0,

  0, 100, 0,
  100, 100, 0,
  0, 100, -100,
  0, 100, -100,
  100, 100, 0,
  100, 100, -100,

  0, 0, 0,
  100, 0, 0,
  0, 100, 0,
  0, 100, 0,
  100, 0, 0,
  100, 100, 0,

  0, 0, -100,
  0, 0, 0,
  0, 100, -100,
  0, 100, -100,
  0, 0, 0,
  0, 100, 0,
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

/* ----------- texture attribute ---------- */

// activate color attribute
let colorBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
let textureCoord = new Float32Array([
  // A
  0, 0,
  0, 0.5,
  0.25, 0,
  0, 0.5,
  0.25, 0.5,
  0.25, 0,

  // B
  0.25, 0,
  0.25, 0.5,
  0.5, 0,
  0.25, 0.5,
  0.5, 0.5,
  0.5, 0,

  // C
  0.5, 0,
  0.5, 0.5,
  0.75, 0,
  0.5, 0.5,
  0.75, 0.5,
  0.75, 0,

  // D
  0.25, 0.5,
  0, 0.5,
  0.25, 1,
  0.25, 1,
  0, 0.5,
  0, 1,

  // E
  0.5, 0.5,
  0.25, 0.5,
  0.5, 1,
  0.5, 1,
  0.25, 0.5,
  0.25, 1,

  // F
  0.75, 0.5,
  0.5, 0.5,
  0.75, 1,
  0.75, 1,
  0.5, 0.5,
  0.5, 1,
])
gl.bufferData(gl.ARRAY_BUFFER, textureCoord, gl.STATIC_DRAW)
gl.enableVertexAttribArray(coordAttributeLocation)
// the data is 8 bit unsigned byte(0 - 255)
size = 2, type = gl.FLOAT, normalize = false, stride = 0, offset = 0
gl.vertexAttribPointer(coordAttributeLocation, size, type, normalize, stride, offset)

/* ----------- texture attribute ---------- */

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
    let offset = 0, count = 6 * 6
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

  initTexture()
}

function resizeCanvas () {
  let cw = mc.width, ch = mc.height, sw = mc.clientWidth, sh = mc.clientHeight
  if (cw !== sw) mc.width = sw
  if (ch !== sh) mc.height = sh
}

function initTexture () {
  // create and bind a texture
  let texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)
  
  // fill the texture with a default color
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]))

  // async load an image
  let image = new Image()
  image.src = 'http://127.0.0.1:9000/img/tx_bet.png'
  image.crossOrigin = 'anonymous'
  image.onload = function () {
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
    gl.generateMipmap(gl.TEXTURE_2D)
  }
}

function clear () {
  gl.clearColor(0, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
}

main()
