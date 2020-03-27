class DrawnObject {
  constructor (options) {
    let { gl, program, bufferInfo } = options
    // vertices
    if (!bufferInfo.numElements)
      bufferInfo = twgl.createBufferInfoFromArrays(gl, bufferInfo)

    // vao是和物体相连的
    let vao = twgl.createVAOFromBufferInfo(gl, program, bufferInfo)
    
    this.gl = gl
    this.context = program
    this.program = program.program
    this.bufferInfo = bufferInfo
    this.vao = vao
    this.options = options
    this.texColor = options.texColor || [1.0, 0.0, 0.0, 1.0]
    this.colorMult = options.colorMult || [1.0, 1.0, 1.0, 1.0]
  }

  draw () {
    let { drawType } = this.options
    let gl = this.gl
    twgl.drawBufferInfo(gl, this.bufferInfo, drawType || gl.TRIANGLES, this.bufferInfo.numElements, 0)
  }
}
