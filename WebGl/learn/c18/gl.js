let mc = getMainCanvas()
let gl = createWebGlContext(mc)

const programInfo = twgl.createProgramInfo(gl, [vt_shader, fm_shader]);

twgl.setAttributePrefix("a_")

let sphereBufferInfo = twgl.primitives.createSphereBufferInfo(gl, 100, 20, 20);

console.log(sphereBufferInfo)

const vao = twgl.createVAOFromBufferInfo(gl, programInfo, sphereBufferInfo)

// transform matrix data
let pr = Object.create(null)
const reversedLightDirection = v3.normalize(vunit(3), [0.5, 0.2, 1.0])
const surfaceColor = v3.normalize(vunit(3), [210, 70, 110])
let worldMatrix = m4unit()

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

  gl.useProgram(programInfo.program)
  // bind the attribute/buffer we set
  gl.bindVertexArray(vao)

  changeM(pr)
  // gl.uniformMatrix4fv(matrixUniformLocation, false, m4mul(pr.m))
  twgl.setUniforms(programInfo, {
    u_matrix: pr.m,
    u_reversedLightDirection: reversedLightDirection,
    u_surfaceColor: surfaceColor,
    u_worldMatrix: worldMatrix
  })

  // render
  twgl.drawBufferInfo(gl, sphereBufferInfo)
}

function initMatrix () {
  pr.pov = 100
  pr.tx = -150
  pr.ty = 0
  pr.tz = -360
  pr.rotx = 0
  pr.roty = 0
  pr.rotz = 0
  pr.sx = 100
  pr.sy = 100
  pr.sz = 100
  Object.defineProperty(pr, 'm', { writable: true, value: {} })
}

function setUniforms () { 
  initRangeWidget('pov', 'tx', 'ty', 'tz', 'rotx', 'roty', 'rotz', 'sx', 'sy', 'sz', pr)
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

  // set the world matrix according to rotation

  // worldMatrix = m4mul(rotationZ, rotationY, rotationX)

  worldMatrix = m4.transpose(m4unit(), m4.invert(m4unit(), m4mul(scale, rotationZ, rotationY, rotationX)))

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
