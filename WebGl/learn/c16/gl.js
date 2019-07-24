let mc = getMainCanvas()
let gl = createWebGlContext(mc)

const programInfo = twgl.createProgramInfo(gl, [vt_shader, fm_shader]);

twgl.setAttributePrefix("a_")

let sphereBufferInfo = flattenedPrimitives.createSphereBufferInfo(gl, 10, 12, 6);

const sphereVAO = twgl.createVAOFromBufferInfo(gl, programInfo, sphereBufferInfo);

let sunNode = new Node();
let earthNode = new Node();
let moonNode = new Node();

// set the relationship
moonNode.setParent(earthNode);
earthNode.setParent(sunNode);

// uniforms that are diffenert from each object
const sunUniform = {
  u_matrix: m4unit(),
  u_mulColor: new Float32Array([1, 0.65, 0.65, 1])
}

const earchUniform = {
  u_matrix: m4mul(m4scale(1,1,1), m4translate(0, 80, 0)),
  u_mulColor: new Float32Array([0.65, 0.65, 1, 1])
}

const moonUniform = {
  u_matrix: m4mul(m4scale(0.3, 0.3, 0.3), m4translate(0, 30, 0)),
  u_mulColor: new Float32Array([0.65, 1, 0.65, 1])
}

// init node local matrix
sunNode.setLocalMatrix(sunUniform.u_matrix);
earthNode.setLocalMatrix(earchUniform.u_matrix);
moonNode.setLocalMatrix(moonUniform.u_matrix);

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

  // draw main scene
  let width = gl.canvas.clientWidth, height = gl.canvas.clientHeight

  // init window
  gl.viewport(0, 0, width, height)

  // clear with white, it should be different from the previous blue
  clear(0, 0, 0, 1)

  gl.useProgram(programInfo.program)
  // bind the attribute/buffer we set
  gl.bindVertexArray(sphereVAO)

  drawObjects(now, width/height) 
  
  // we call requestAnimationFrame again to keep on animating
  requestAnimationFrame(render)
}

function drawObjects (now, ratio) {
  
  // inverse matrix of camera matrix
  let caPosition = [0, 0, -200], center = [0, 0, 0], up = [0, 1, 0]

  // be careful that this util handled invert by default, so we needn't do that by ourselves
  let caMatrix = m4.lookAt(m4unit(), caPosition, center, up)

  // perspective matrix
  let pov = Math.PI / 3
  let perspective = m4.perspective(m4unit(), pov, ratio, 1, 2000)

  // if use projectio instead of perspective, then camera matrix no longer works
  // let projection = m4unit();
  // m4.ortho(projection, 0, width, height, 0, -100, 100);
  // let pmatrix = m4mul(m4translate(width/2, height/2, 0), projection);
  let pmatrix = perspective;

  /* ----------- animation ----------- */
  if (!then) then = now
  else {
    currot += (now - then) / 1000 * rotPerSecond
    then = now
  }
  /* ----------- animation ----------- */

  // set all matrix
  let rotationY = m4rotateY(toRad(0.3));
  let rotationZ = m4rotateZ(toRad(0.3));

  let sunMatrix = m4mul(sunNode.localMatrix, rotationZ);
  let earchMatrix = m4mul(earthNode.localMatrix, rotationZ);
  let moonMatrix = m4mul(moonNode.localMatrix, rotationZ);

  sunNode.setLocalMatrix(sunMatrix);
  earthNode.setLocalMatrix(earchMatrix);
  moonNode.setLocalMatrix(moonMatrix);

  // update world matrix;
  sunNode.updateWorldMatrixInfo();

  gl.bindVertexArray(sphereVAO);
  
  // draw spheres
  // draw the sun
  twgl.setUniforms(programInfo, { 
    u_matrix: m4mul(sunNode.worldMatrix, caMatrix, pmatrix),
    u_mulColor: sunUniform.u_mulColor
  })

  twgl.drawBufferInfo(gl, sphereBufferInfo)

  // draw the earch
  twgl.setUniforms(programInfo, { 
    u_matrix: m4mul(earthNode.worldMatrix, caMatrix, pmatrix),
    u_mulColor: earchUniform.u_mulColor
  })

  twgl.drawBufferInfo(gl, sphereBufferInfo)

  // draw the moon
  twgl.setUniforms(programInfo, { 
    u_matrix: m4mul(moonNode.worldMatrix, caMatrix, pmatrix),
    u_mulColor: moonUniform.u_mulColor
  })

  twgl.drawBufferInfo(gl, sphereBufferInfo)
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
