let mc = getMainCanvas()
let gl = createWebGlContext(mc)

const programInfo = twgl.createProgramInfo(gl, [vt_shader, fm_shader]);

twgl.setAttributePrefix("a_")

// FpositionCoord and FnormalCoords are attribute information, I tracked them in ../bin/attribute.js
const arrays = {
  position: FpositionCoord,
  normal: FnormalCoords
}

// const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays)
// we now get "F" from a more easy way
const bufferInfo = twgl.primitives.create3DFBufferInfo(gl)

const vao = twgl.createVAOFromBufferInfo(gl, programInfo, bufferInfo)

/* start  gui control init */
const context = {
  message: 'ok',
  sitaX: 0,
  sitaY: 12,
  sitaZ: -180,
}
const gui = new dat.GUI()
gui.domElement = document.querySelector('#control-box')
gui.add(context, 'message')
let c1 = gui.add(context, 'sitaX', -180, 180)
let c2 = gui.add(context, 'sitaY', -180, 180)
let c3 = gui.add(context, 'sitaZ', -180, 180)
c1.onChange(render)
c2.onChange(render)
c3.onChange(render)
/* end of gui control init */

// width & height of the seperated parts
let effectiveWidth = gl.canvas.clientWidth / 2
let effectiveHeight = gl.canvas.clientHeight

function main () {
  render()
}

function render () {
  // make inner size the same as css size 
  resizeCanvas()

  // see only clockwise triangles
  gl.enable(gl.CULL_FACE)

  // depth test
  gl.enable(gl.DEPTH_TEST)

  // enable scissor test, for multiple screen useages
  gl.enable(gl.SCISSOR_TEST)

  let mm = getMatrix()
  // draw left side
  let vleft = [0, 0, effectiveWidth, effectiveHeight]
  drawScene(vleft, mm.oMatrix)

  // draw right side
  let vright = [effectiveWidth, 0, effectiveWidth, effectiveHeight]
  drawScene(vright, mm.pMatrix)
}

function drawScene (viewport, uMatrix, options) {
  // init window
  gl.viewport.apply(gl, viewport)
  gl.scissor.apply(gl, viewport)
  clear(gl)

  gl.useProgram(programInfo.program)
  // bind the attribute/buffer we set
  gl.bindVertexArray(vao)

  twgl.setUniforms(programInfo, {
    u_matrix: uMatrix
  })

  // render
  twgl.drawBufferInfo(gl, bufferInfo)
}

function resizeCanvas () {
  let cw = mc.width, ch = mc.height, sw = mc.clientWidth, sh = mc.clientHeight
  if (cw !== sw) mc.width = sw
  if (ch !== sh) mc.height = sh
}

function getMatrix () {
  let sitaX = toRad(context.sitaX), c1 = Math.cos(sitaX), s1 = Math.sin(sitaX),
      sitaY = toRad(context.sitaY), c2 = Math.cos(sitaY), s2 = Math.sin(sitaY),
      sitaZ = toRad(context.sitaZ), c3 = Math.cos(sitaZ), s3 = Math.sin(sitaZ),
      tx = ty = tz = 0,
      sx = sy = sz = 1,
      pov = toRad(120)

  ty = 100
  tz = 50

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
  // in this situation, only perspective is needed

  // perspective conversion
  let aspect = effectiveWidth / effectiveHeight, perspective = []
  m4.perspective(perspective, pov, aspect, 1, 2000)

  let halfHeight = effectiveHeight / 2,  ortho = []
  // ortho(out, left, right, bottom, top, near, far)
  m4.ortho( ortho, -halfHeight * aspect, halfHeight * aspect, -halfHeight, halfHeight, -75, 2000 )
  
  let caPosition = [0, 0, -75], center = [0, 0, 0], up = [0, 1, 0]
  // be careful that this util handled invert by default, so we needn't do that by ourselves
  let caMatrix = m4.lookAt(m4unit(), caPosition, center, up)

  let cMatrix = m4mul( scale, rotationZ, rotationY, rotationX, translation, caMatrix )

  return { pMatrix: m4mul(cMatrix, perspective), oMatrix: m4mul(cMatrix, ortho) }
}

function clear () {
  gl.clearColor(0.3, 0.6, 0.9, 1)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
}

main()
