const WIDTHPIX = 900
const HEIGHTPIX = 600
const sin = Math.sin
const PI = Math.PI
const globalContext = { eye_x: 0, eye_y: 1000, eye_z: 470, rot: 10, pov: 50 }

function getCameraPositions (scale = 1) {
  const positions = [
    -1, -1,  1,  // cube vertices
      1, -1,  1,
    -1,  1,  1,
      1,  1,  1,
    -1, -1,  3,
      1, -1,  3,
    -1,  1,  3,
      1,  1,  3,
      0,  0,  1,  // cone tip
  ];
  const indices = [
    0, 1, 1, 3, 3, 2, 2, 0, // cube indices
    4, 5, 5, 7, 7, 6, 6, 4,
    0, 4, 1, 5, 3, 7, 2, 6,
  ];
  // add cone segments
  const numSegments = 6;
  const coneBaseIndex = positions.length / 3; 
  const coneTipIndex =  coneBaseIndex - 1;
  for (let i = 0; i < numSegments; ++i) {
    const u = i / numSegments;
    const angle = u * Math.PI * 2;
    const x = Math.cos(angle);
    const y = Math.sin(angle);
    positions.push(x, y, 0);
    // line from tip to edge
    indices.push(coneTipIndex, coneBaseIndex + i);
    // line from point on edge to next point on edge
    indices.push(coneBaseIndex + i, coneBaseIndex + (i + 1) % numSegments);
  }
  positions.forEach((v, ndx) => {
    positions[ndx] *= scale;
  });
  return {
    position: positions,
    indices,
  };
}

function setCubeUniformsScene1 (programContext, context) {
  const umatrix = getUMatrixValue({
    transform: { rotx: context.rot, roty: context.rot },
    perspective: { pov: context.pov, width: WIDTHPIX/2, height: HEIGHTPIX },
    camera: context
  })
  twgl.setUniforms(programContext, {'u_matrix': umatrix})
}

function setCubeUniformsScene2 (programContext, context) {
  const umatrix = getUMatrixValue({
    transform: { rotx: context.rot, roty: context.rot },
    perspective: { pov: 110, width: WIDTHPIX/2, height: HEIGHTPIX },
    camera: { eye_x: 0, eye_y: 2000, eye_z: 0 }
  })
  twgl.setUniforms(programContext, { 'u_matrix': umatrix })
}

function setCameraUniformsScene2 (programContext, context) {
  const camera1Matrix = camera(context)
  const umatrixCamera = getUMatrixValue({
    transform: m4.inverse(camera1Matrix),
    perspective: { pov: 110, width: WIDTHPIX/2, height: HEIGHTPIX },
    camera: { eye_x: 0, eye_y: 2000, eye_z: 0 }
  })
  twgl.setUniforms(programContext, { 'u_matrix_camera': umatrixCamera })
}

function initGUI (context, cb) {
  const gui = new dat.GUI()
  let eye_x = gui.add(context, 'eye_x', -1000, 1000)
  let eye_y = gui.add(context, 'eye_y', -1000, 1000)
  let eye_z = gui.add(context, 'eye_z', -1000, 1000)
  let rot = gui.add(context, 'rot', -180, 180)
  let pov = gui.add(context, 'pov', 0, 180)
  let elements = [eye_x, eye_y, eye_z, rot, pov]
  elements.forEach(item => item.onChange(cb))
}

window.onload = function main () {
  if (!twgl || !flattenedPrimitives) {
    console.log('enhanced twgl start failed, program automatically exit')
    return
  }
  const gl = createCanvasAndWebgl2Context()
  if (!gl) return

  twgl.setAttributePrefix('a_')
  twgl.setRandColorFn('complete_random')
  let cube = new DrawnObject({ 
    gl,
    vshader: Shader.getCubeVertexShaderSource(), 
    fshader: Shader.getCubeFragmentShaderSource(),
    bufferInfo: flattenedPrimitives.createCubeBufferInfo(gl, 400)
  })

  let camera = new DrawnObject({
    gl,
    vshader: Shader.getCameraVertexShaderSource(),
    fshader: Shader.getCameraFragmentShaderSource(),
    bufferInfo: getCameraPositions(50),
    drawType: gl.LINES
  })

  rerender()

  function rerender () {
    // draw scene 1
    // 画相机1看到的景物
    {
      cube.preDraw({ viewport: [0, 0, WIDTHPIX/2, HEIGHTPIX], refresh: true })
      setCubeUniformsScene1(cube.context, globalContext)
      cube.draw()
    }
    // draw scene 2
    // 画相机2看到的景物：它同时看到了相机1和物体
    {
      cube.preDraw({ viewport: [WIDTHPIX/2, 0, WIDTHPIX/2, HEIGHTPIX], refresh: true })
      setCubeUniformsScene2(cube.context, globalContext)
      cube.draw()

      camera.preDraw({ viewport: [WIDTHPIX/2, 0, WIDTHPIX/2, HEIGHTPIX], refresh: false })
      setCameraUniformsScene2(camera.context, globalContext)
      camera.draw()
    }
    
  } 

  initGUI(globalContext, rerender)
}
