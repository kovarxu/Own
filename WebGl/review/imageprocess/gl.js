const WIDTHPIX = 600
const HEIGHTPIX = 600
const PORT = 8062

function createCanvasAndWebgl2Context () {
  let canvas = document.createElement('canvas')
  canvas.width = WIDTHPIX
  canvas.height = HEIGHTPIX

  let gl = canvas.getContext('webgl2')

  if (!gl) {
    console.log('您的浏览器不支持webgl2')
    return
  }

  document.body.appendChild(canvas)

  return gl
}

function getVertexShaderSource () {
  // webgl2 需要始终在首行加上版本声明
  return `#version 300 es
  // 外部传入的attibution
  in vec2 a_position;
  uniform vec2 resolution;

  // 纹理信息
  out vec2 v_relative_poz;

  void main () {
    v_relative_poz = a_position / 200.0;
    gl_Position = vec4(v_relative_poz, 0.0, 1.0);
  }
  `
}

function getFragmentShaderSource () {
  return `#version 300 es
  // 浮点数精度设定，高精度需要消耗更多性能
  precision mediump float;
  in vec2 v_relative_poz;
  out vec4 outColor;
  // 纹理
  uniform sampler2D u_texture;

  uniform float brightness;
  uniform float contrast;
  uniform float saturation;

  vec3 hsv2rgb(vec3 c) {
      const vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
      vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
      return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }
  
  vec3 rgb2hsv(vec3 c) {
      const vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
      vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
      vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
  
      float d = q.x - min(q.w, q.y);
      return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + 0.001)), d / (q.x + 0.001), q.x);
  }

  void main () {
    vec2 p = v_relative_poz;
    vec3 a = rgb2hsv(texture(u_texture, p).rgb);
    vec3 m = a + vec3(contrast/100.0, saturation/100.0, brightness/100.0);
    outColor = vec4(hsv2rgb(m), 1.0);
    // outColor = texture(u_texture, v_relative_poz);
  }
  `
}

function draw (gl, program, bufferInfo, vao) {
  gl.viewport(0, 0, WIDTHPIX, HEIGHTPIX)
  // 清空屏幕
  gl.clearColor(0, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT)

  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);

  gl.useProgram(program.program || program)
  gl.bindVertexArray(vao)

  let primitiveType = gl.TRIANGLES // 画三角形
  let offset = 0 // 偏移量
  // let count = 36 // 点的数量
  gl.drawArrays(primitiveType, offset, bufferInfo.numElements)
  // gl.drawElements(primitiveType, count, gl.UNSIGNED_SHORT, offset)
  // twgl.drawBufferInfo(gl, bufferInfo, primitiveType, count, offset)
}

function setUniforms (gl, programContext, context) {
  gl.useProgram(programContext.program)
  twgl.setUniforms(programContext, { 
    resolution: [WIDTHPIX, HEIGHTPIX],
    ...context
  })
}

function ortho () {
  let ratio = 2
  // left, right, bottom, up, near, far
  return m4.ortho(-WIDTHPIX/ratio, WIDTHPIX/ratio, -HEIGHTPIX/ratio, HEIGHTPIX/ratio, -300, 300)
}

function getTransformMatrix (pr) {
  // set rotation orientation to clockwise
  let translation = m4.m4translate(pr.tx, pr.ty, pr.tz),
      rotationX = m4.m4rotateX(toRad(+pr.rotx)),
      rotationY = m4.m4rotateY(toRad(+pr.roty)),
      rotationZ = m4.m4rotateZ(toRad(+pr.rotz)),
      scale = m4.m4scale(+pr.sx/100, +pr.sy/100, +pr.sz/100)

  return m4.m4mul( scale, rotationZ, rotationY, rotationX, translation )
}

function getTexture (gl, callback) {
  return twgl.createTexture(gl, {
    target: gl.TEXTURE_2D,
    level: 0,
    width: 1,
    height: 1,
    internalFormat: gl.RGBA,
    type: gl.UNSIGNED_BYTE,
    color: [0.8, 0.6, 1, 1],
    src: 'http://localhost:8062/imgs/blueflower2.jpg',
    crossOrigin: 'anonymous'
  }, callback)
}

function getMapVertices () {
  return {
    position: {
      numComponents: 2,
      data: [
        0, 200, 0, 0, 200, 0,
        0, 200, 200, 0, 200, 200
      ]
    }
  }
}

function initGUI (context, cb) {
  const gui = new dat.GUI()
  // gui.domElement = document.querySelector('#control-box')
  let brightness = gui.add(context, 'brightness', -100, 100)
  let contrast = gui.add(context, 'contrast', -100, 100)
  let saturation = gui.add(context, 'saturation', -100, 100)
  
  let elements = [brightness, contrast, saturation]
  elements.forEach(item => item.onChange(cb))
}

window.onload = function main () {
  if (!twgl || !flattenedPrimitives) {
    console.log('enhanced twgl start failed, program automatically exit')
    return
  }
  const gl = createCanvasAndWebgl2Context()
  if (!gl) return

  const vertexShaderSource = getVertexShaderSource()
  const fragmentShaderSource = getFragmentShaderSource()
  const programContext = twgl.createProgramInfo(gl, [vertexShaderSource, fragmentShaderSource])

  twgl.setAttributePrefix('a_')
  const mapVertices = getMapVertices()
  const mapVerticesBufferInfo = twgl.createBufferInfoFromArrays(gl, mapVertices)
  const vao = twgl.createVAOFromBufferInfo(gl, programContext, mapVerticesBufferInfo)
  let texture = getTexture(gl, rerender)

  const context = { brightness: 10, contrast: 10, saturation: 0 }

  rerender()

  initGUI(context, rerender)

  function rerender () {
    setUniforms(gl, programContext, context)
    draw(gl, programContext, mapVerticesBufferInfo, vao)
  }
}
