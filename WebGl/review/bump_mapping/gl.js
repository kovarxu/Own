const WIDTHPIX = 900
const HEIGHTPIX = 600
const sin = Math.sin
const PI = Math.PI
const globalContext = { eye_x: -6, eye_y: 14, eye_z: -4, t_tx: 0.3, t_ty: 7.5, t_tz: -1.1, tex_scale: 100, perspective: false }
const globalTextures = {}

function setPlainUniformsScene1(programContext, context) {
  const textureMatrix = getUMatrixValue({
    transform: { 
      sx: context.tex_scale,
      sy: context.tex_scale, 
      sz: context.tex_scale 
    },
    perspective: {
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
  twgl.setUniforms(programContext, {'u_texture_mapping': globalTextures.mapping})
}

function setSphereUniformsScene1(programContext, context) {
  twgl.setUniforms(programContext, {'u_world_matrix': getUMatrixValue({
    transform: { ty: 3 },
  })})
  twgl.setUniforms(programContext, {'u_color_orig': [0.9, 0.6, 0.3, 1.0]})
}

function setViewUniformsScene1(programContext, context) {
  const textureMatrix = getUMatrixValue({
    transform: { 
      sx: context.tex_scale,
      sy: context.tex_scale, 
      sz: context.tex_scale 
    },
    perspective: {
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
  let elements = [eye_x, eye_y, eye_z, t_tx, t_ty, t_tz, tex_scale]
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
  let program1 = twgl.createProgramInfo(gl, [
    Shader.getCustomVertexShaderSource(), 
    Shader.getCustomFragmentShaderSource()
  ])

  let program2 = twgl.createProgramInfo(gl, [
    Shader.getViewVertexShaderSource(),
    Shader.getViewFragmentShaderSource()
  ])

  // 每个物体都有一个bufferInfo，初始化它还需要一个program用于将其attr数据导入shader程序
  let plain = new DrawnObject({
    gl,
    program: program1,
    bufferInfo: twgl.primitives.createPlaneBufferInfo(gl, 20, 20, 1, 1)
  })

  let sphere = new DrawnObject({
    gl,
    program: program1,
    bufferInfo: twgl.primitives.createSphereBufferInfo(gl, 1.6, 20, 20)
  })

  let view = new DrawnObject({
    gl,
    program: program2,
    bufferInfo: getClipspaceCubeVertices(gl),
    drawType: gl.LINES
  })

  // 加载两幅纹理
  globalTextures.default = getDefaultTexture(gl, rerender)
  globalTextures.mapping = getMappingTexture(gl, rerender)

  rerender()

  function rerender () {
    // draw scene
    {
      preDraw(gl, { programContext: program1, vao: plain.vao, viewport: [0, 0, WIDTHPIX, HEIGHTPIX], refresh: true })
      setPlainUniformsScene1(program1, globalContext)
      plain.draw()
    }
    {
      preDraw(gl, { programContext: program1, vao: sphere.vao, viewport: [0, 0, WIDTHPIX, HEIGHTPIX] })
      setSphereUniformsScene1(program1, globalContext)
      sphere.draw()
    }
    {
      preDraw(gl, { programContext: program2, vao: view.vao, viewport: [0, 0, WIDTHPIX, HEIGHTPIX] })
      setViewUniformsScene1(program2, globalContext)
      view.draw()
    }
  } 

  initGUI(globalContext, rerender)
}

