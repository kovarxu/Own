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
  out vec2 v_poz;

  void main () {
    vec2 poz = a_position / 256.0;
    gl_Position = vec4(poz.x - 0.3, poz.y - 0.3, 0.0, 1.0);
    v_poz = vec2(poz.x, 1.0 - poz.y);
  }
  `
}

function getFragmentShaderSource () {
  return `#version 300 es
  // 浮点数精度设定，高精度需要消耗更多性能
  precision mediump float;

  in vec2 v_poz;
  out vec4 outColor;
  
  // 纹理
  uniform sampler2D u_texture0;
  uniform sampler2D u_texture1;

  // 变暗
  vec3 darken (vec3 x, vec3 y) {
    return min(x, y);
  }

  // 变亮
  vec3 lighten (vec3 x, vec3 y) {
    return max(x, y);
  }

  // 正片叠底
  vec3 lap (vec3 x, vec3 y) {
    return x * y;
  }

  // 颜色加深
  vec3 deepen (vec3 x, vec3 y) {
    return x - (1.0 - x) * (1.0 - y) / y;
  }

  // 颜色减淡
  vec3 dodge (vec3 x, vec3 y) {
    return x + x * y / (1.0 - y);
  }

  float overlapHelper (float x, float y) {
    if (x <= 0.5) {
      return x * y / 0.5;
    } else {
      return 1.0 - (1.0 - x) * (1.0 - y) / 0.5;
    }
  }

  // 叠加
  vec3 overlap (vec3 x, vec3 y) {
    return vec3(overlapHelper(x.x, y.x), overlapHelper(x.y, y.y), overlapHelper(x.z, y.z));
  }

  // 强光
  vec3 strongLight (vec3 x, vec3 y) {
    return vec3(overlapHelper(y.x, x.x), overlapHelper(y.y, x.y), overlapHelper(y.z, x.z));
  }

  float softLightHelper (float x, float y) {
    if (x <= 0.5) {
      return x * y / 0.5 + x * x * (1.0 - 2.0 * y);
    } else {
      return x * (1.0 - y) / 0.5 + sqrt(x) * (2.0 * y - 1.0);
    }
  }

  // 柔光
  vec3 softLight (vec3 x, vec3 y) {
    return vec3(softLightHelper(x.x, y.x), softLightHelper(x.y, y.y), softLightHelper(x.z, y.z));
  }

  // 类型
  uniform int type;

  void main () {
    vec4 t0 = texture(u_texture0, v_poz);
    vec4 t1 = texture(u_texture1, v_poz);

    vec3 color = vec3(1.0);
    if (type == 1) {
      color = darken(t0.xyz, t1.xyz);
    } else if (type == 2) {
      color = lighten(t0.xyz, t1.xyz);
    } else if (type == 3) {
      color = lap(t0.xyz, t1.xyz);
    } else if (type == 4) {
      color = deepen(t0.xyz, t1.xyz);
    } else if (type == 5) {
      color = dodge(t0.xyz, t1.xyz);
    } else if (type == 6) {
      color = overlap(t0.xyz, t1.xyz);
    } else if (type == 7) {
      color = strongLight(t0.xyz, t1.xyz);
    } else if (type == 8) {
      color = softLight(t0.xyz, t1.xyz);
    }

    outColor = vec4(color, 1.0);
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

function getTexture (gl, callback) {
  return twgl.createTextures(gl, {
    texture0: {
      target: gl.TEXTURE_2D,
      level: 0,
      width: 1,
      height: 1,
      internalFormat: gl.RGBA,
      type: gl.UNSIGNED_BYTE,
      color: [0.8, 0.6, 1, 1],
      src: 'http://localhost:8062/imgs/greg/flower-2.jpg',
      crossOrigin: 'anonymous'
    },
    texture1: {
      target: gl.TEXTURE_2D,
      level: 0,
      width: 1,
      height: 1,
      internalFormat: gl.RGBA,
      type: gl.UNSIGNED_BYTE,
      color: [0.9, 0.6, 0.4, 1],
      src: 'http://localhost:8062/imgs/greg/flower-4.jpg',
      crossOrigin: 'anonymous'
    }
  }, callback)
}

function getMapVertices () {
  return {
    position: {
      numComponents: 2,
      data: [
        0, 256, 0, 0, 256, 0,
        0, 256, 256, 0, 256, 256
      ]
    }
  }
}

function initGUI (context, cb) {
  const gui = new dat.GUI()
  // gui.domElement = document.querySelector('#control-box')
  let type = gui.add(context, 'type', {
    '变暗': 1,
    '变亮': 2,
    '正片叠底': 3,
    '颜色加深': 4,
    '颜色减淡': 5,
    '叠加': 6,
    '强光': 7,
    '柔光': 8
  })
  
  let elements = [type]
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
  let textures = getTexture(gl, rerender)

  const context = { type: 1, u_texture0: textures.texture0, u_texture1: textures.texture1 }

  rerender()

  initGUI(context, rerender)

  function rerender () {
    setUniforms(gl, programContext, context)
    draw(gl, programContext, mapVerticesBufferInfo, vao)
  }
}
