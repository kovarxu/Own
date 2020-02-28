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

/* --------------------- */
// matrix 
;(function(global) {
  if (global.twgl) {
    const m4 = global.m4 = global.twgl.m4
    const v3 = global.v3 = global.twgl.v3
    
    // 4d matrix multiply
    m4.m4mul = function () {
      let rest = Array.prototype.slice.call(arguments)
      let mul = twgl.m4.multiply
      let out = m4.m4unit()
      if (rest.length && mul) {
        rest.forEach(item => {
          out = mul(item, out)
        })
      }
      return out
    }

    // identity matrix, or unit matrix
    v3.m3unit = function () {
      return [
        1, 0, 0,
        0, 1, 0,
        0, 0, 1
      ]
    }

    m4.m4unit = function () {
      return [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
      ]
    }

    m4.vunit = function (n) {
      return Array(n).fill(1)
    }

    m4.m4translate = function (tx, ty, tz) {
      tx = tx || 0, ty = ty || 0, tz = tz || 0
      return [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        tx, ty, tz, 1
      ]
    }

    m4.m4rotateX = function (r) {
      var c = Math.cos(r), s = Math.sin(r)
      return [
        1, 0, 0, 0,
        0, c, s, 0,
        0,-s, c, 0,
        0, 0, 0, 1
      ]
    }

    m4.m4rotateY = function (r) {
      var c = Math.cos(r), s = Math.sin(r)
      return [
        c, 0,-s, 0,
        0, 1, 0, 0,
        s, 0, c, 0,
        0, 0, 0, 1
      ]
    }

    m4.m4rotateZ = function (r) {
      var c = Math.cos(r), s = Math.sin(r)
      return [
        c, s, 0, 0,
       -s, c, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
      ]
    }

    m4.m4scale = function (sx, sy, sz) {
      sx = sx || 1, sy = sy || 1, sz = sz || 1
      return [
        sx, 0,  0,  0,
        0, sy,  0,  0,
        0,  0, sz,  0,
        0,  0,  0,  1
      ]
    }
    
    // to radian util
    const degree = Math.PI / 180;

    global.toRad = function toRadian(a) {
      return a * degree;
    }

    global.toDegree = function toDegree(a) {
      return a / degree;
    }
  }
})(window)

/* --------------------- */

// image import
function importMultiImages (srcs, race, all) {
  if (srcs && srcs.length) {
    let num = srcs.length, imageElems = []
    const imageLoadCb = function (index) {
      num--
      if (race) race.call(this, imageElems, index)
      if (num === 0 && all) all.call(this, imageElems, index)
    }
    srcs.forEach((src, index) => {
      imageElems[index] = importImage(src, index, imageLoadCb)
    })
  }
}

function importImage (src, index, cb) {
  let image = new Image()
  image.crossOrigin = 'anonymous'
  image.src = src
  image.onload = () => cb.call(null, index)
  return image
}

// hack of twgl.js

function addRandomColorBuffer (buffer) {
  let numElements = buffer.numElements
  let curand = 0
  let array = Array.from({ length: numElements * 4 }, (x, i) => {
    let j = i+1;
    if (j && j % 4 === 0) return 1;
    else if (j % 4 === 1) return curand = Math.random() * 0.3 + 0.7;
    else return curand;
  }) 
  let arrays = { color: array }
  let colorbuffer = twgl.createBufferInfoFromArrays(gl, arrays);
  buffer.attribs.a_color = colorbuffer.attribs.a_color;
}