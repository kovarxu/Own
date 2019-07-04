function main () {
  let mc = getMainCanvas()
  let gl = createWebGlContext(mc)

  let vts = createShader(gl, gl.VERTEX_SHADER, vt_shader)
  let fms = createShader(gl, gl.FRAGMENT_SHADER, fm_shader)

  let program = createProgram(gl, vts, fms)

  // found attribute and uniform
  let positionAttributeLocation = gl.getAttribLocation(program, 'a_position')
  let resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution')
  let translateUniformLocation = gl.getUniformLocation(program, 'u_translation')
  
  // create and bind buffer
  let positionBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  // buffer data
  let positions = [0, 0, 0, 50, 43, 0]
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
  
  // create and bind vao
  let vao = gl.createVertexArray()
  gl.bindVertexArray(vao)
  
  // activate attribute
  gl.enableVertexAttribArray(positionAttributeLocation)
  // bind the current ARRAY_BUFFER to attribute
  let size = 2, type = gl.FLOAT, normalize = false, stride = 0, offset = 0
  gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset)
  
  // init window
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
  gl.clearColor(0, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT)

  gl.useProgram(program)
  // bind the attribute/buffer we set
  gl.bindVertexArray(vao)

  {
    let width = gl.canvas.width, height = gl.canvas.height
    let offsetX = 50, offsetY = 70
    gl.uniform2f(resolutionUniformLocation, width, height)
    gl.uniform2f(translateUniformLocation, offsetX, offsetY)
  }

  {
    let primitiveType = gl.TRIANGLES
    let offset = 0, count = 3
    gl.drawArrays(primitiveType, offset, count)
  }
}

main()
