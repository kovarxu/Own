const WIDTHPIX = 900
const HEIGHTPIX = 600
const sin = Math.sin
const PI = Math.PI
const globalContext = { eye_x: -6, eye_y: 14, eye_z: -4, t_tx: 0.3, t_ty: 7.5, t_tz: -1.1, tex_scale: 100, tex_pov: 90 }
const globalTextures = {}
const DEPTH_TEXTURE_SIZE = 512

function setPlainUniformForDepthBuffer(programContext, context, drawnObj) {
  const convertMatrix = m4.m4mul(m4.m4translate(1, 1, 0), m4.m4scale(0.5, 0.5, 1.0))

  twgl.setUniforms(programContext, {'u_world_matrix': getTransformMatrix({
    sx: context.tex_scale,
    sy: context.tex_scale, 
    sz: context.tex_scale 
  })})

  twgl.setUniforms(programContext, {'u_camera_matrix': camera({
    eye_x: context.t_tx,
    eye_y: context.t_ty,
    eye_z: context.t_tz
  })})

  twgl.setUniforms(programContext, {'u_view_matrix': m4.m4mul(perspective({
    pov: context.tex_pov,
    width: context.tex_scale,
    height: context.tex_scale,
    near: 0.1,
    far: 200
  })), convertMatrix})

  twgl.setUniforms(programContext, { 'u_color': drawnObj.texColor })
}

function setPlainUniformsScene1(programContext, context) {
  const textureMatrix = getUMatrixValue({
    transform: { 
      sx: context.tex_scale,
      sy: context.tex_scale, 
      sz: context.tex_scale 
    },
    perspective: {
      pov: context.tex_pov,
      width: context.tex_scale,
      height: context.tex_scale,
      near: 0.1,
      far: 200
    },
    camera: {
      eye_x: context.t_tx,
      eye_y: context.t_ty,
      eye_z: context.t_tz
    }
  })
  // [-1, 1] => [0, 1]
  const convertMatrix = m4.m4mul(m4.m4translate(1, 1, 0), m4.m4scale(0.5, 0.5, 1.0))
  twgl.setUniforms(programContext, {'u_world_matrix': m4.m4unit()})
  twgl.setUniforms(programContext, {'u_camera_matrix': camera(context)})
  twgl.setUniforms(programContext, {'u_view_matrix': perspective({ width: WIDTHPIX, height: HEIGHTPIX })})
  twgl.setUniforms(programContext, {'u_texture_matrix': m4.m4mul(textureMatrix, convertMatrix)})
  twgl.setUniforms(programContext, {'u_color_orig': [1.0, 1.0, 1.0, 1.0]})
  twgl.setUniforms(programContext, {'u_texture_custom': globalTextures.default})
  // twgl.setUniforms(programContext, {'u_texture_mapping': depthFrameBufferInfo.texture})
  twgl.setUniforms(programContext, {'u_texture_mapping': globalTextures.depthFrameBufferInfo.attachments[0]})
}

function setSphereUniformsScene1(programContext, context, drawnObj) {
  twgl.setUniforms(programContext, {'u_world_matrix': getUMatrixValue({
    transform: { tx: 1.5, ty: 4 },
  })})
  twgl.setUniforms(programContext, {'u_color_orig': drawnObj.colorMult})
  twgl.setUniforms(programContext, { 'u_color': drawnObj.texColor })
}

function setCubeUniformScene1(programContext, context, drawnObj) {
  twgl.setUniforms(programContext, {'u_world_matrix': getUMatrixValue({
    transform: { tx: -3, ty: 3 },
  })})
  twgl.setUniforms(programContext, {'u_color_orig': drawnObj.colorMult})
  twgl.setUniforms(programContext, { 'u_color': drawnObj.texColor })
}

function setViewUniformsScene1(programContext, context, drawnObj) {
  const textureMatrix = getUMatrixValue({
    transform: { 
      sx: context.tex_scale,
      sy: context.tex_scale, 
      sz: context.tex_scale 
    },
    perspective: {
      pov: context.tex_pov,
      width: context.tex_scale,
      height: context.tex_scale,
      near: 0.1,
      far: 200
    },
    camera: {
      eye_x: context.t_tx,
      eye_y: context.t_ty,
      eye_z: context.t_tz
    }
  })
  const transformMatrix = getUMatrixValue({
    transform: {
      sz: 10000
    }
  })
  
  twgl.setUniforms(programContext, {'u_world_matrix': m4.m4mul(transformMatrix, m4.inverse(textureMatrix))})
  twgl.setUniforms(programContext, {'u_camera_matrix': camera(context)})
  twgl.setUniforms(programContext, {'u_view_matrix': perspective({ width: WIDTHPIX, height: HEIGHTPIX })})
  twgl.setUniforms(programContext, {'u_color': drawnObj.texColor})
}

function initGUI (context, cb) {
  const gui = new dat.GUI()
  let eye_x = gui.add(context, 'eye_x', -20, 20)
  let eye_y = gui.add(context, 'eye_y', -20, 20)
  let eye_z = gui.add(context, 'eye_z', -20, 20)
  let t_tx = gui.add(context, 't_tx', -5.0, 10.0)
  let t_ty = gui.add(context, 't_ty', -5.0, 10.0)
  let t_tz = gui.add(context, 't_tz', -5.0, 10.0)
  let tex_scale = gui.add(context, 'tex_scale', 20, 1000)
  let tex_pov = gui.add(context, 'tex_pov', 20, 180)
  let elements = [eye_x, eye_y, eye_z, t_tx, t_ty, t_tz, tex_scale, tex_pov]
  elements.forEach(item => item.onChange(cb))
}

function preDraw (gl, { programContext, vao, viewport, clearColor=[1, 1, 1, 1], refresh=false }) {
  // 清空屏幕
  if (refresh) {
    if (viewport) {
      gl.viewport.apply(gl, viewport)
      gl.scissor.apply(gl, viewport)
    }
    
    gl.clearColor.apply(gl, clearColor)
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
  // gl.bindAttribLocation(program, 0, "a_position") ...
  // program之间复用顶点数据的方法
  // 在shader中使用 `layout(location = 0) in vec4 a_position` 这种语句亦可
  const programOptions = {
    attribLocations: {
      'a_position': 0,
      'a_normal':   1,
      'a_texcoord': 2,
      'a_color':    3,
    }
  }

  // 每个program代表一个shader程序
  let program1 = twgl.createProgramInfo(gl, [
    Shader.getCustomVertexShaderSource(), 
    Shader.getCustomFragmentShaderSource()
  ], programOptions)

  let program2 = twgl.createProgramInfo(gl, [
    Shader.getViewVertexShaderSource(),
    Shader.getViewFragmentShaderSource()
  ], programOptions)

  // 每个物体都有一个bufferInfo，初始化它还需要一个program用于将其attr数据导入shader程序
  let plain = new DrawnObject({
    gl,
    program: program1,
    texColor: [1.0, 0.0, 0.0, 1.0],
    bufferInfo: twgl.primitives.createPlaneBufferInfo(gl, 30, 30, 1, 1)
  })

  let sphere = new DrawnObject({
    gl,
    program: program1,
    texColor: [0.0, 0.0, 1.0, 1.0],
    colorMult: [0.9, 0.6, 0.3, 1.0],
    bufferInfo: twgl.primitives.createSphereBufferInfo(gl, 1.6, 20, 20)
  })

  let cube = new DrawnObject({
    gl,
    program: program1,
    texColor: [0.0, 0.0, 1.0, 1.0],
    colorMult: [0.6, 0.8, 0.1, 1.0],
    bufferInfo: twgl.primitives.createCubeBufferInfo(gl, 2)
  })

  let view = new DrawnObject({
    gl,
    program: program2,
    bufferInfo: getClipspaceCubeVertices(gl),
    texColor: [0.0, 0.0, 0.0, 1.0],
    drawType: gl.LINES
  })

  // 加载默认纹理
  globalTextures.default = getDefaultTexture(gl, rerender)
  // 创建frameBuffer写入深度数据
  globalTextures.depthFrameBufferInfo = getDepthFrameBuffer(gl, DEPTH_TEXTURE_SIZE)
  depthFrameBufferInfo = createDepthTexAndFrameBuffer(gl, DEPTH_TEXTURE_SIZE)

  rerender()

  function rerender () {
    twgl.bindFramebufferInfo(gl, globalTextures.depthFrameBufferInfo)
    // gl.bindFramebuffer(gl.FRAMEBUFFER, depthFrameBufferInfo.framebuffer);
    // draw scene
    {
      preDraw(gl, { programContext: program2, vao: plain.vao, viewport: [0, 0, DEPTH_TEXTURE_SIZE, DEPTH_TEXTURE_SIZE], refresh: true })
      setPlainUniformForDepthBuffer(program2, globalContext, plain)
      plain.draw()
    }
    {
      preDraw(gl, { programContext: program2, vao: sphere.vao })
      setSphereUniformsScene1(program2, globalContext, sphere)
      sphere.draw()
    }
    {
      preDraw(gl, { programContext: program2, vao: cube.vao })
      setCubeUniformScene1(program2, globalContext, cube)
      cube.draw()
    }
    // twgl.bindFramebufferInfo(gl, null)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    {
      preDraw(gl, { programContext: program1, vao: plain.vao, viewport: [0, 0, WIDTHPIX, HEIGHTPIX], refresh: true })
      setPlainUniformsScene1(program1, globalContext, plain)
      plain.draw()
    }
    {
      preDraw(gl, { programContext: program1, vao: sphere.vao })
      setSphereUniformsScene1(program1, globalContext, sphere)
      sphere.draw()
    }
    {
      preDraw(gl, { programContext: program1, vao: cube.vao })
      setCubeUniformScene1(program1, globalContext, cube)
      cube.draw()
    }
    {
      preDraw(gl, { programContext: program2, vao: view.vao, viewport: [0, 0, WIDTHPIX, HEIGHTPIX] })
      setViewUniformsScene1(program2, globalContext, view)
      view.draw()
    }
  } 

  initGUI(globalContext, rerender)
}

