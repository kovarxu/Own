let mc = getMainCanvas()
let gl = createWebGlContext(mc)

const programInfo = twgl.createProgramInfo(gl, [vt_shader, fm_shader]);

twgl.setAttributePrefix("a_")

let sphereBufferInfo = flattenedPrimitives.createSphereBufferInfo(gl, 10, 20, 20);
const sphereVAO = twgl.createVAOFromBufferInfo(gl, programInfo, sphereBufferInfo);

// uniforms that are diffenert from each object
const sphereUniforms = {
  u_matrix: [],
  u_mulColor: new Float32Array([0.8, 0.5, 0.5, 1])
}

// animation global variables
let then = 0, currot = 0
const rotPerSecond = 50

// sphere list
const spheres = Array.from({length: 50}, () => {return {
  x: Math.random() * 600 - 300,
  y: Math.random() * 400 - 200,
  color: new Float32Array([Math.random(), Math.random(), Math.random(), 1])
}})

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

  // draw main scene
  let width = gl.canvas.clientWidth, height = gl.canvas.clientHeight

  // init window
  gl.viewport(0, 0, width, height)

  // clear with white, it should be different from the previous blue
  clear(1, 1, 1, 1)

  // bind the attribute/buffer we set
  gl.bindVertexArray(sphereVAO)
  
  gl.useProgram(programInfo.program)
  
  drawObjects(now, width, height) 
  
  // we call requestAnimationFrame again to keep on animating
  requestAnimationFrame(render)
}

function drawObjects (now, width, height) {
  
  // inverse matrix of camera matrix
  let caPosition = [0, 0, 60], center = [0, 0, 0], up = [0, 1, 0]

  // be careful that this util handled invert by default, so we needn't do that by ourselves
  let caMatrix = m4.lookAt(m4unit(), caPosition, center, up)

  // perspective matrix
  let ratio = width / height
  let pov = Math.PI / 2
  // let perspective = m4.perspective(m4unit(), pov, ratio, 1, 2000)
  let ortho = m4.ortho(m4unit(), -width/2, width/2, -height/2, height/2, 200, -200)

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

  for (let i = 0; i < spheres.length; i++) {
    let sphere = spheres[i]

    // draw sphere
    gl.bindVertexArray(sphereVAO);
    translation = m4translate(sphere.x, sphere.y, 0)

    twgl.setUniforms(programInfo, { 
      // u_matrix: m4mul(rotationY, rotationX, translation, caMatrix, perspective),
      u_matrix: m4mul(rotationY, rotationX, translation, caMatrix, ortho),
      u_mulColor: sphere.color
    })

    twgl.drawBufferInfo(gl, sphereBufferInfo)
  }
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
