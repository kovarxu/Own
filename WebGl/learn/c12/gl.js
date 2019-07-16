let mc = getMainCanvas()
let gl = createWebGlContext(mc)

let vts = createShader(gl, gl.VERTEX_SHADER, vt_shader)
let fms = createShader(gl, gl.FRAGMENT_SHADER, fm_shader)

let program = createProgram(gl, vts, fms)

// found attribute and uniform
let positionAttributeLocation = gl.getAttribLocation(program, 'a_position')
let coordAttributeLocation = gl.getAttribLocation(program, 'a_textcoord')
// unifiorm attribute u_matrix
let matrixUniformLocation = gl.getUniformLocation(program, 'u_matrix')
let kernelUniformLocation = gl.getUniformLocation(program, 'u_kernel[0]')
let kernelWeightUniformLocation = gl.getUniformLocation(program, 'u_kernel_weight')

// create and bind buffer
let positionBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
// buffer data
let a = 256
let positions = [
  0, 0,
  0, a,
  a, 0,
  a, 0,
  0, a,
  a, a
]
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

// create and bind vao
let vao = gl.createVertexArray()
gl.bindVertexArray(vao)

// activate point attribute
gl.enableVertexAttribArray(positionAttributeLocation)
// bind the current ARRAY_BUFFER to attribute
let size = 2, type = gl.FLOAT, normalize = false, stride = 0, offset = 0
gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset)

// texture image
let image

/* ----------- texture attribute ---------- */

// activate color attribute
let colorBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
let textureCoord = new Float32Array([
  0, 0,
  0, 1,
  1, 0,
  1, 0,
  0, 1,
  1, 1
])
gl.bufferData(gl.ARRAY_BUFFER, textureCoord, gl.STATIC_DRAW)
gl.enableVertexAttribArray(coordAttributeLocation)
// the data is 8 bit unsigned byte(0 - 255)
size = 2, type = gl.FLOAT, normalize = false, stride = 0, offset = 0
gl.vertexAttribPointer(coordAttributeLocation, size, type, normalize, stride, offset)

/* ----------- texture attribute ---------- */

// kernel sets
const kernelSettings = [
  {
    name: 'Sharpen',
    data: [
      0, -1,  0,
      -1,  5, -1,
      0, -1,  0,
    ]
  },
  {
    name: 'EdgeDetect',
    data: [
      -1, -1, -1,
      -1,  8, -1,
      -1, -1, -1,
    ]
  },
  {
    name: 'GaussBlur',
    data: [
      0.045, 0.122, 0.045,
      0.122, 0.332, 0.122,
      0.045, 0.122, 0.045,
    ]
  },
  {
    name: 'BoxBlur',
    data: [
      0.111, 0.111, 0.111,
      0.111, 0.111, 0.111,
      0.111, 0.111, 0.111,
    ]
  },
  {
    name: 'Emboss',
    data: [
      -2, -1,  0,
      -1,  1,  1,
      0,  1,  2,
    ]
  }
]
let currentKernelIndex = 0
initSelectWidget('#kernel', kernelSettings, [changeKernelIndex, render])

function main () {
  // init textures
  initTexture()

  // draw first screen
  render()
}

function render () {
  // make inner size the same as css size 
  resizeCanvas()

  // init window
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
  clear(gl)

  gl.useProgram(program)
  // bind the attribute/buffer we set
  gl.bindVertexArray(vao)

  // init kernel
  initKernel()

  // apply projection matrix
  applyUniformMatrix()

  drawArray(6)
}

function applyUniformMatrix () {
  let width = gl.canvas.clientWidth, height = gl.canvas.clientHeight

  // this projection regart up as -y, not y, it does some good to handle texture coord(no longer upside down).
  let matrix = projection = [
    2/width, 0, 0,
    0, -2/height, 0,
    -0.9, 0.9, 1
  ]

  gl.uniformMatrix3fv(matrixUniformLocation, false, matrix)
}

function initTexture () {
  // create and bind a texture
  let texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)
  
  // fill the texture with a default color
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]))

  // async load an image
  let image = new Image()
  image.src = 'http://127.0.0.1:9000/img/blueflower.jpg'
  image.crossOrigin = 'anonymous'
  image.onload = function () {
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
    gl.generateMipmap(gl.TEXTURE_2D)
    render()
  }
}

function initKernel () {
  let curKernel = new Float32Array(kernelSettings[currentKernelIndex].data)
  let kernelWeight = computeKernelWeight(curKernel)
  console.log(kernelWeight)

  gl.uniform1fv(kernelUniformLocation, curKernel)
  gl.uniform1f(kernelWeightUniformLocation, kernelWeight)
}

function changeKernelIndex (kernel, index) {
  currentKernelIndex = index
}

function drawArray (count) {
  count = count || 0
  let primitiveType = gl.TRIANGLES
  let offset = 0
  gl.drawArrays(primitiveType, offset, count)
}

function resizeCanvas () {
  let cw = mc.width, ch = mc.height, sw = mc.clientWidth, sh = mc.clientHeight
  if (cw !== sw) mc.width = sw
  if (ch !== sh) mc.height = sh
}

function clear () {
  gl.clearColor(0, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
}

function computeKernelWeight (kernel) {
  let sum = kernel.reduce((prev, next) => {
    return prev + next
  })
  return sum <= 0 ? 1 : sum
}

main()
