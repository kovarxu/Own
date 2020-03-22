const WIDTHPIX = 900
const HEIGHTPIX = 600
const sin = Math.sin
const PI = Math.PI
const globalContext = { eye_x: 0, eye_y: 0, eye_z: 25, rotx: 0, roty: 180, rotz: 90 }
const globalTextures = {}
const DEPTH_TEXTURE_SIZE = 512
let timer = 0

function setSphereUniformsScene1(programContext, context) {
  twgl.setUniforms(programContext, {'u_world_matrix': getTransformMatrix(context)})
  twgl.setUniforms(programContext, {'u_camera_matrix': camera(context)})
  // twgl.setUniforms(programContext, {'u_view_matrix': perspective({ width: WIDTHPIX, height: HEIGHTPIX })})
  twgl.setUniforms(programContext, {'u_view_matrix': ortho({ width: WIDTHPIX, height: HEIGHTPIX })})
  twgl.setUniforms(programContext, {'u_texture': globalTextures.earth})
}

function initGUI (context, cb) {
  const gui = new dat.GUI()
  let eye_x = gui.add(context, 'eye_x', -20, 20)
  let eye_y = gui.add(context, 'eye_y', -20, 20)
  let eye_z = gui.add(context, 'eye_z', -10, 35)
  let rotx = gui.add(context, 'rotx', -180, 180)
  let roty = gui.add(context, 'roty', -180, 180)
  let rotz = gui.add(context, 'rotz', -180, 180)
  let elements = [ eye_x, eye_y, eye_z, rotx, roty, rotz ]
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

  let program = twgl.createProgramInfo(gl, [
    Shader.getViewVertexShaderSource(),
    Shader.getViewFragmentShaderSource()
  ])

  let sphere = new DrawnObject({
    gl,
    program: program,
    texColor: [0.0, 0.0, 1.0, 1.0],
    colorMult: [0.9, 0.6, 0.3, 1.0],
    bufferInfo: twgl.primitives.createSphereBufferInfo(gl, 300, 50, 50)
  })

  // 加载默认纹理
  globalTextures.earth = getEarthTexture2D(gl, rerender)

  rerender()

  requestAnimationFrame(tick)

  function tick(time) {
    const rotSpeed = 0.008
    if (timer === 0) {
      timer = time
    }
    delta = (time - timer) * rotSpeed
    timer = time
    globalContext.rotx += delta
    rerender()

    requestAnimationFrame(tick)
  }

  function rerender () {
    preDraw(gl, { programContext: program, vao: sphere.vao, viewport: [0, 0, WIDTHPIX, HEIGHTPIX], refresh: true })
    setSphereUniformsScene1(program, globalContext)
    sphere.draw()
  }

  initGUI(globalContext, rerender)
}

