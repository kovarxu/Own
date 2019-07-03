function main () {
  let mc = getMainCanvas()
  let gl = createWebGlContext(mc)

  let vts = createShader(gl, gl.VERTEX_SHADER, vt_shader)
  let fms = createShader(gl, gl.FRAGMENT_SHADER, fm_shader)

  let program = createProgram(gl, vts, fms)

  // 
  let positionAttributeLocation = gl.getAttribLocation(program, 'a_position')
  
  // attribute get data from buffer, so a buffer is needed
  let positionBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

  // put data in the buffer
  let positions = [0, 0, 0, 0.5, 0.7, 0]
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

  // we need to tell the attribute how to get data out of buffer
  // first we need to create a collection of attribute state called a Vertex Array Object
  let vao = gl.createVertexArray()
  gl.bindVertexArray(vao)

  // turn the attribute on
  gl.enableVertexAttribArray(positionAttributeLocation)

  // bind the current ARRAY_BUFFER to attribute
  let size = 2, type = gl.FLOAT, normalize = false, stride = 0, offset = 0
  gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset)


  // set viewport
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
  
  // clear 
  gl.clearColor(0, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT)

  gl.useProgram(program)
  // bind the attribute/buffer we set
  gl.bindVertexArray(vao)
  {
    let primitiveType = gl.TRIANGLES
    let offset = 0, count = 3
    gl.drawArrays(primitiveType, offset, count)
  }
}

main()