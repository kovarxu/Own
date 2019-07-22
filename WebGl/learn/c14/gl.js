let mc = getMainCanvas()
let gl = createWebGlContext(mc)

// let vts = createShader(gl, gl.VERTEX_SHADER, vt_shader)
// let fms = createShader(gl, gl.FRAGMENT_SHADER, fm_shader)

// let program = createProgram(gl, vts, fms)

// found attribute and uniform
// let positionAttributeLocation = gl.getAttribLocation(program, 'a_position')
// let coordAttributeLocation = gl.getAttribLocation(program, 'a_textcoord')
// unifiorm attribute u_matrix
// let matrixUniformLocation = gl.getUniformLocation(program, 'u_matrix')
// let textureLocation = gl.getUniformLocation(program, 'u_texture')

const programInfo = twgl.createProgramInfo(gl, [vt_shader, fm_shader]);

// create and bind buffer
// let positionBuffer = gl.createBuffer()
// gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
// buffer data
const positionCoord = [
  -0.5, -0.5,  -0.5,
  -0.5,  0.5,  -0.5,
    0.5, -0.5,  -0.5,
  -0.5,  0.5,  -0.5,
    0.5,  0.5,  -0.5,
    0.5, -0.5,  -0.5,

  -0.5, -0.5,   0.5,
    0.5, -0.5,   0.5,
  -0.5,  0.5,   0.5,
  -0.5,  0.5,   0.5,
    0.5, -0.5,   0.5,
    0.5,  0.5,   0.5,

  -0.5,   0.5, -0.5,
  -0.5,   0.5,  0.5,
    0.5,   0.5, -0.5,
  -0.5,   0.5,  0.5,
    0.5,   0.5,  0.5,
    0.5,   0.5, -0.5,

  -0.5,  -0.5, -0.5,
    0.5,  -0.5, -0.5,
  -0.5,  -0.5,  0.5,
  -0.5,  -0.5,  0.5,
    0.5,  -0.5, -0.5,
    0.5,  -0.5,  0.5,

  -0.5,  -0.5, -0.5,
  -0.5,  -0.5,  0.5,
  -0.5,   0.5, -0.5,
  -0.5,  -0.5,  0.5,
  -0.5,   0.5,  0.5,
  -0.5,   0.5, -0.5,

    0.5,  -0.5, -0.5,
    0.5,   0.5, -0.5,
    0.5,  -0.5,  0.5,
    0.5,  -0.5,  0.5,
    0.5,   0.5, -0.5,
    0.5,   0.5,  0.5,
].map(item => item * 150)

const textureCoord = new Float32Array([
  0, 0,
  0, 1,
  1, 0,
  0, 1,
  1, 1,
  1, 0,

  0, 0,
  0, 1,
  1, 0,
  1, 0,
  0, 1,
  1, 1,

  0, 0,
  0, 1,
  1, 0,
  0, 1,
  1, 1,
  1, 0,

  0, 0,
  0, 1,
  1, 0,
  1, 0,
  0, 1,
  1, 1,

  0, 0,
  0, 1,
  1, 0,
  0, 1,
  1, 1,
  1, 0,

  0, 0,
  0, 1,
  1, 0,
  1, 0,
  0, 1,
  1, 1,
])
// gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

// create and bind vao
// let vao = gl.createVertexArray()
// gl.bindVertexArray(vao)

// activate point attribute
// gl.enableVertexAttribArray(positionAttributeLocation)
// bind the current ARRAY_BUFFER to attribute
// let size = 3, type = gl.FLOAT, normalize = false, stride = 0, offset = 0
// gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset)
twgl.setAttributePrefix("a_")

const arrays = {
  position: positionCoord,
  textcoord: textureCoord
}

const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays)
console.log(bufferInfo)

const vao = twgl.createVAOFromBufferInfo(gl, programInfo, bufferInfo);

/* ----------- texture attribute ---------- 

// activate color attribute
let colorBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
let textureCoord = new Float32Array([
  0, 0,
  0, 1,
  1, 0,
  0, 1,
  1, 1,
  1, 0,

  0, 0,
  0, 1,
  1, 0,
  1, 0,
  0, 1,
  1, 1,

  0, 0,
  0, 1,
  1, 0,
  0, 1,
  1, 1,
  1, 0,

  0, 0,
  0, 1,
  1, 0,
  1, 0,
  0, 1,
  1, 1,

  0, 0,
  0, 1,
  1, 0,
  0, 1,
  1, 1,
  1, 0,

  0, 0,
  0, 1,
  1, 0,
  1, 0,
  0, 1,
  1, 1,
])
gl.bufferData(gl.ARRAY_BUFFER, textureCoord, gl.STATIC_DRAW)
gl.enableVertexAttribArray(coordAttributeLocation)
// the data is 8 bit unsigned byte(0 - 255)
size = 2, type = gl.FLOAT, normalize = false, stride = 0, offset = 0
gl.vertexAttribPointer(coordAttributeLocation, size, type, normalize, stride, offset)

/* ----------- texture attribute ---------- */

// animation global variables
let then = 0, currot = 0
const rotPerSecond = 50

// texture and frame buffer
let texture, targetTexture, fb
const targetWidth = 256, targetHeight = 256

function main () {
  // init texture and frame buffer
  initTextures()
  bindFrameBuffer()

  // draw first screen
  requestAnimationFrame(render)
}

function render (now) {
  // see only clockwise triangles
  gl.enable(gl.CULL_FACE)

  // depth test
  gl.enable(gl.DEPTH_TEST)

  // make inner size the same as css size 
  resizeCanvas()

  // draw frame buffer first
  {
    // activate 
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb)
    gl.bindTexture(gl.TEXTURE_2D, texture)

    gl.viewport(0, 0, targetWidth, targetHeight)
    clear(0, 0, 1, 1)

    gl.useProgram(programInfo.program)
    // bind the attribute/buffer we set
    gl.bindVertexArray(vao)

    drawObject(now, targetWidth / targetHeight, texture)
  }

  // draw main scene
  {
    let width = gl.canvas.clientWidth, height = gl.canvas.clientHeight

    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.bindTexture(gl.TEXTURE_2D, targetTexture)

    // init window
    gl.viewport(0, 0, width, height)

    // clear with white, it should be different from the previous blue
    clear(1, 1, 1, 1)

    gl.useProgram(programInfo.program)
    // bind the attribute/buffer we set
    gl.bindVertexArray(vao)

    drawObject(now, width / height, targetTexture) 
  }
  
  // we call requestAnimationFrame again to keep on animating
  requestAnimationFrame(render)
}

function drawObject (now, ratio, tx) {
  
  // inverse matrix of camera matrix
  let caPosition = [0, 0, 200], center = [0, 0, 0], up = [0, 1, 0]

  // be careful that this util handled invert by default, so we needn't do that by ourselves
  let caMatrix = m4.lookAt(m4unit(), caPosition, center, up)

  // perspective matrix
  let pov = Math.PI / 2
  let perspective = m4.perspective(m4unit(), pov, ratio, 1, 2000)

  /* ----------- animation ----------- */
  if (!then) then = now
  else {
    currot += (now - then) / 1000 * rotPerSecond
    then = now
  }
  /* ----------- animation ----------- */

  let rotationY = m4rotateY(toRad(currot))
  let rotationX = m4rotateX(-toRad(currot) / 2)
  let translation = m4translate(0, 0, 0)
  let matrix = m4mul(rotationY, rotationX, translation, caMatrix, perspective)
  // gl.uniformMatrix4fv(matrixUniformLocation, false, matrix)
  // gl.uniform1i(textureLocation, 0);

  twgl.setUniforms(programInfo, {
    u_matrix: matrix,
    u_texture: tx
  })

  // render
  // let primitiveType = gl.TRIANGLES
  // let offset = 0, count = 6 * 6
  // gl.drawArrays(primitiveType, offset, count)
  twgl.drawBufferInfo(gl, bufferInfo)
}

function resizeCanvas () {
  let cw = mc.width, ch = mc.height, sw = mc.clientWidth, sh = mc.clientHeight
  if (cw !== sw) mc.width = sw
  if (ch !== sh) mc.height = sh
}

function initTextures () {
  /* ------- create and bind child texture stt ------- */

  texture = gl.createTexture()

  // use texture unit 0
  gl.activeTexture(gl.TEXTURE0 + 0);

  gl.bindTexture(gl.TEXTURE_2D, texture)

  {
    const level = 0 // mipmap level
    const innerFormat = gl.R8 // gpu will get this format
    const width = 3
    const height = 2
    const border = 0
    const format = gl.RED // format in webgl
    const type = gl.UNSIGNED_BYTE //supplied format 
    const pixels = new Uint8Array([
      128, 64, 128,
      0, 192, 0
    ])

    const alignment = 1
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, alignment) // webgl, as opengl, only support 2**n data texture width, so an alignment should be given to pad it.

    gl.texImage2D(gl.TEXTURE_2D, level, innerFormat, width, height, border, format, type, pixels)

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  }

  /* ------- create and bind child texture end ------- */

  /* ------- create and bind target texture stt ------- */

  targetTexture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, targetTexture)

  {
    const level = 0 // mipmap level
    const innerFormat = gl.RGBA // gpu will get this format
    const width = targetWidth
    const height = targetHeight
    const border = 0
    const format = gl.RGBA // format in webgl
    const type = gl.UNSIGNED_BYTE //supplied format 
    const pixels = null
    gl.texImage2D(gl.TEXTURE_2D, level, innerFormat, width, height, border, format, type, pixels)

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  }

  /* ------- create and bind target texture end ------- */
}

function bindFrameBuffer () {
  // create a frame buffer to render on
  fb = gl.createFramebuffer()
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb)

  // bind the frame buffer and our texture
  const attachmentPoint = gl.COLOR_ATTACHMENT0
  const level = 0
  gl.framebufferTexture2D(gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, targetTexture, level)
}

function clear (r, g, b, a) {
  gl.clearColor(r, g, b, a)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
}

main()
