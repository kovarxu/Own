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
  if (global.glMatrix) {
    const mat3 = global.m3 = global.glMatrix.mat3
    const mat4 = global.m4 = global.glMatrix.mat4
    const toRad = global.glMatrix.glMatrix.toRadian
    
    // 3d matrix multiply
    global.m3mul = function () {
      let rest = Array.prototype.slice.call(arguments)
      let mul = mat3.mul
      let out = [
        1, 0, 0,
        0, 1, 0,
        0, 0, 1
      ]
      if (rest.length && mul) {
        rest.forEach(item => {
          mul(out, item, out)
        })
      }
      return out
    }

    // 4d matrix multiply
    global.m4mul = function () {
      let rest = Array.prototype.slice.call(arguments)
      let mul = mat4.mul
      let out = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
      ]
      if (rest.length && mul) {
        rest.forEach(item => {
          mul(out, item, out)
        })
      }
      return out
    }

    // identity matrix, or unit matrix
    global.m3unit = function () {
      return [
        1, 0, 0,
        0, 1, 0,
        0, 0, 1
      ]
    }

    global.m4unit = function () {
      return [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
      ]
    }

    global.m4translate = function (tx, ty, tz) {
      tx = tx || 0, ty = ty || 0, tz = tz || 0
      return [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        tx, ty, tz, 1
      ]
    }

    global.m4rotateX = function (r) {
      var c = Math.cos(r), s = Math.sin(r)
      return [
        1, 0, 0, 0,
        0, c, s, 0,
        0,-s, c, 0,
        0, 0, 0, 1
      ]
    }

    global.m4rotateY = function (r) {
      var c = Math.cos(r), s = Math.sin(r)
      return [
        c, 0,-s, 0,
        0, 1, 0, 0,
        s, 0, c, 0,
        0, 0, 0, 1
      ]
    }

    global.m4rotateZ = function (r) {
      var c = Math.cos(r), s = Math.sin(r)
      return [
        c, s, 0, 0,
       -s, c, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
      ]
    }

    global.m4scale = function (sx, sy, sz) {
      sx = sx || 1, sy = sy || 1, sz = sz || 1
      return [
        sx, 0,  0,  0,
        0, sy,  0,  0,
        0,  0, sz,  0,
        0,  0,  0,  1
      ]
    }
    
    // to radian util
    global.toRad = toRad
  }
})(window)

/* --------------------- */
// control widget
function initRangeWidget () {
  let args = Array.prototype.slice.call(arguments)
  if (args.length === 0) return
  let obj = args[args.length-1]
  if (typeof obj === 'object') {
    for (let i = 0; i < args.length - 1; i++) {
      let key = args[i]
      let ele = document.querySelector('#' + key)
      if (ele) {
        let liveDataDisplayEle = ele.nextSibling
        ele.oninput = function () {
          obj[key] = ele.value
          if (liveDataDisplayEle) liveDataDisplayEle.innerHTML = ele.value
        }
      }
    }
  }
}

function observe (obj, cbs) {
  if (!obj || typeof obj !== 'object') return
  if (!obj.__ob__) {
    if (typeof cbs === 'function') cbs = [cbs]
    for (key in obj) {
      let val = obj[key]
      if (val !== undefined) {
        Object.defineProperty(obj, key, {
          get () {
            return val
          },
          set (newVal) {
            if (newVal !== val) {
              val = newVal
              cbs.forEach(cb => cb.call(this, obj))
            }
          }
        })
      }
    }
  }
  obj.__ob__ = true
}

