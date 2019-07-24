let mc = getMainCanvas()
let gl = createWebGlContext(mc)

const programInfo = twgl.createProgramInfo(gl, [vt_shader, fm_shader]);

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

twgl.setAttributePrefix("a_")

const arrays = {
  position: positionCoord,
  textcoord: textureCoord
}

const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays)

const vao = twgl.createVAOFromBufferInfo(gl, programInfo, bufferInfo);


// animation global variables
let then = 0, currot = 0
const rotPerSecond = 50

function main () {
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

function clear (r, g, b, a) {
  gl.clearColor(r, g, b, a)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
}

main()
