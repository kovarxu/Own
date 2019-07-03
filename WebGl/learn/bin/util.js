function getMainCanvas () {
  let c
  if (c = document.querySelector('#mc')) {
    return c
  } else {
    warn('找不到根canvas元素！')
  }
}

function warn () {
  let arg = [].slice.call(arguments)
  console.warn.apply(null, arg)
}

function createWebGlContext (mc) {
  let wgx
  try {
    wgx = mc.getContext('webgl2')
  } catch (e) {
    warn(e)
  }
  return wgx
}


/*
  create shader
  type is gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
  source is shader's string
*/
function createShader (gl, type, source) {
  let shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  
  let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  warn(gl.getShaderInfoLog(shader))
  gl.deleteShader(shader)
}


/*
  create program
*/
function createProgram (gl, vertexShader, fragmentShader) {
  let program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  
  let success = gl.getProgramParameter(program, gl.LINK_STATUS)
  if (success) {
    return program
  }

  warn(gl.getProgramInfoLog(program))
  gl.deleteProgram(program)
}

