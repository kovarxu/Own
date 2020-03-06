class DrawnObject {
  constructor (options) {
    let { gl, vshader, fshader, bufferInfo } = options
    // vertices
    if (!bufferInfo.numElements)
      bufferInfo = twgl.createBufferInfoFromArrays(gl, bufferInfo)

    let programContext = twgl.createProgramInfo(gl, [vshader, fshader])
    let vao = twgl.createVAOFromBufferInfo(gl, programContext, bufferInfo)
    
    this.gl = gl
    this.context = programContext
    this.program = programContext.program
    this.bufferInfo = bufferInfo
    this.vao = vao
    this.options = options
  }

  preDraw ({ viewport, clearColor=[0, 0, 0, 0], refresh=false }) {
    let gl = this.gl
    gl.viewport.apply(gl, viewport)
    // 清空屏幕
    if (refresh) {
      gl.scissor.apply(gl, viewport)
      gl.clearColor.apply(gl, clearColor || [0, 0, 0, 0])
      gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT)

      gl.enable(gl.CULL_FACE);
      gl.enable(gl.DEPTH_TEST);
      gl.enable(gl.SCISSOR_TEST)
    }
    
    gl.useProgram(this.program)
    gl.bindVertexArray(this.vao)
  }

  draw () {
    let { drawType } = this.options
    let gl = this.gl
    twgl.drawBufferInfo(gl, this.bufferInfo, drawType || gl.TRIANGLES, this.bufferInfo.numElements, 0)
  }
}
