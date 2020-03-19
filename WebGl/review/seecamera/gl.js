const WIDTHPIX = 900
const HEIGHTPIX = 600
const sin = Math.sin
const PI = Math.PI
const globalContext = { eye_x: 0, eye_y: 1000, eye_z: 470, rot: 10, pov: 50, near: 1, far: 5000 }

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

function getClipspaceCubeVertices(gl) {
  // first let's add a cube. It goes from 1 to 3
  // because cameras look down -Z so we want
  // the camera to start at Z = 0. We'll put a
  // a cone in front of this cube opening
  // toward -Z
  const positions = [
    -1, -1, -1,  // cube vertices
     1, -1, -1,
    -1,  1, -1,
     1,  1, -1,
    -1, -1,  1,
     1, -1,  1,
    -1,  1,  1,
     1,  1,  1,
  ];
  const indices = [
    0, 1, 1, 3, 3, 2, 2, 0, // cube indices
    4, 5, 5, 7, 7, 6, 6, 4,
    0, 4, 1, 5, 3, 7, 2, 6,
  ];
  return {
    position: positions,
    indices
  };
}

function setCubeUniformsScene1 (programContext, context) {
  const umatrix = getUMatrixValue({
    transform: { rotx: context.rot, roty: context.rot },
    perspective: { ...context, width: WIDTHPIX/2, height: HEIGHTPIX },
    // ortho: { ...context, width: WIDTHPIX/2, height: HEIGHTPIX, },
    camera: context
  })
  twgl.setUniforms(programContext, {'u_matrix': umatrix})
}

function setCubeUniformsScene2 (programContext, context) {
  const umatrix = getUMatrixValue({
    transform: { rotx: context.rot, roty: context.rot },
    perspective: { pov: 110, width: WIDTHPIX/2, height: HEIGHTPIX, far: 10000 },
    camera: { eye_x: 0, eye_y: 2000, eye_z: 0 }
  })
  twgl.setUniforms(programContext, { 'u_matrix': umatrix })
}

function setCameraUniformsScene2 (programContext, context) {
  // 理解camera矩阵的逻辑：camera通过一个lookAt变换可以变到指定的位置
  // 但是camera是视点，所以在其他的元素（物体）上加一个lookAt的逆矩阵，即可达到camera观察的目的
  // 如果有多个camera，camera2看到了camera1，在camera2的视野里面，camera1就要加上自己的lookAt（变到指定位置）
  // 但是由于此时的视点不是camera1，故不需求逆
  const camera1Matrix = camera(context)
  const umatrixCamera = getUMatrixValue({
    transform: m4.inverse(camera1Matrix),
    // 比较inverse矩阵和直接translate的区别
    // transform: { tx: context.eye_x, ty: context.eye_y, tz: context.eye_z },
    perspective: { pov: 110, width: WIDTHPIX/2, height: HEIGHTPIX, far: 10000 },
    camera: { eye_x: 0, eye_y: 2000, eye_z: 0 }
  })
  twgl.setUniforms(programContext, { 'u_matrix_camera': umatrixCamera })
}

function setFrustumUniformsScene2 (programContext, context) {
  // 先要还原出视锥体才能行
  // frustum提供的是perspective空间的坐标系，即xyz三方向均为-1 ~ 1
  // 但是如果乘以了scene1 perspective的逆矩阵，则能还原出world空间坐标系中实际的视锥体
  // 然后这个视锥体要跟随camera1，所以还要类似camer1的操作乘以一个lookAt
  const camera1Matrix = camera(context)
  const perspectiveInScene1 = perspective({ ...context, width: WIDTHPIX/2, height: HEIGHTPIX })
  // const orthoInScene1 = ortho({ ...context, width: WIDTHPIX/2, height: HEIGHTPIX })
  const umatrixCamera = getUMatrixValue({
    transform: m4.m4mul(m4.inverse(perspectiveInScene1), m4.inverse(camera1Matrix)),
    // transform: m4.m4mul(m4.inverse(orthoInScene1), m4.inverse(camera1Matrix)),
    perspective: { pov: 110, width: WIDTHPIX/2, height: HEIGHTPIX, far: 10000 },
    camera: { eye_x: 0, eye_y: 2000, eye_z: 0 }
  })
  twgl.setUniforms(programContext, { 'u_matrix_camera': umatrixCamera })
}

function initGUI (context, cb) {
  const gui = new dat.GUI()
  let eye_x = gui.add(context, 'eye_x', -3000, 3000)
  let eye_y = gui.add(context, 'eye_y', -3000, 3000)
  let eye_z = gui.add(context, 'eye_z', -3000, 3000)
  let rot = gui.add(context, 'rot', -180, 180)
  let pov = gui.add(context, 'pov', 0, 180)
  let near = gui.add(context, 'near', -3000, 3000)
  let far = gui.add(context, 'far', -10000, 10000)
  let elements = [eye_x, eye_y, eye_z, rot, pov, near, far]
  elements.forEach(item => item.onChange(cb))
}

function preDraw (gl, { programContext, vao, viewport, clearColor=[0, 0, 0, 0], refresh=false }) {
  // 清空屏幕
  if (refresh) {
    gl.viewport.apply(gl, viewport)
    gl.scissor.apply(gl, viewport)
    gl.clearColor.apply(gl, clearColor || [0, 0, 0, 0])
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT)

    gl.enable(gl.CULL_FACE)
    gl.enable(gl.DEPTH_TEST)
    gl.enable(gl.SCISSOR_TEST)
  }
  
  gl.useProgram(programContext.program)
  gl.bindVertexArray(vao)
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

  // 每个program代表一个shader程序
  // 要想绘制多个相同顶点、不同shader的物体，实际上需要生成多个program
  // 但是vao可以共用，因为vao只和bufferInfo绑定在一起
  let program1 = twgl.createProgramInfo(gl, [
    Shader.getCubeVertexShaderSource(), 
    Shader.getCubeFragmentShaderSource()
  ])

  let program2 = twgl.createProgramInfo(gl, [
    Shader.getCameraVertexShaderSource(), 
    Shader.getCameraFragmentShaderSource()
  ])

  // 每个物体都有一个bufferInfo，初始化它还需要一个program用于将其attr数据导入shader程序
  let cube = new DrawnObject({ 
    gl,
    program: program1,
    bufferInfo: flattenedPrimitives.createCubeBufferInfo(gl, 400)
  })

  let camera = new DrawnObject({
    gl,
    program: program2,
    bufferInfo: getCameraPositions(50),
    drawType: gl.LINES
  })

  let frustum = new DrawnObject({
    gl,
    program: program2,
    bufferInfo: getClipspaceCubeVertices(),
    drawType: gl.LINES
  })

  rerender()

  function rerender () {
    // draw scene 1
    // 画相机1看到的景物
    {
      preDraw(gl, { programContext: program1, vao: cube.vao, viewport: [0, 0, WIDTHPIX/2, HEIGHTPIX], refresh: true })
      setCubeUniformsScene1(program1, globalContext)
      cube.draw()
    }
    // draw scene 2
    // 画相机2看到的景物：它同时看到了相机1和物体
    {
      preDraw(gl, { programContext: program1, vao: cube.vao, viewport: [WIDTHPIX/2, 0, WIDTHPIX/2, HEIGHTPIX], refresh: true })
      setCubeUniformsScene2(program1, globalContext)
      cube.draw()

      preDraw(gl, { programContext: program2, vao: camera.vao })
      setCameraUniformsScene2(program2, globalContext)
      camera.draw()

      preDraw(gl, { programContext: program2, vao: frustum.vao })
      setFrustumUniformsScene2(program2, globalContext)
      frustum.draw()
    }
    
  } 

  initGUI(globalContext, rerender)
}

/*
实体之间的连接关系：

shader ----- program

vao ----- object

*/
