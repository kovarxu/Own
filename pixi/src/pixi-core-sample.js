import pCore from 'pixi-gl-core';

const vertexShaderSource = `
attribute vec2 a_position;
attribute vec2 a_texcoord;
varying vec2 v_texcoord;

void main() {
    gl_Position = vec4(a_position.xy, 0.0, 1.0);
    v_texcoord = a_texcoord;
}
`

const fragmentShaderSource = `
precision mediump float;
varying vec2 v_texcoord;
uniform sampler2D u_Sampler;

void main() {
    gl_FragColor = texture2D(u_Sampler, v_texcoord);
}
`
function to512 (img) {
  const canvas = document.createElement('canvas')
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0);
  return canvas;
}

export default class PRenderer {
  constructor (canvas, options) {
    this.gl = pCore.createContext(canvas);
    this.init();
  }

  init() {
    this.createRenderProgram(this.gl);
    this.createBuffer(this.gl);
    this.createVAO(this.gl);
  }

  createRenderProgram(gl) {
    this.program = new pCore.GLShader(gl, vertexShaderSource, fragmentShaderSource);
  }

  createBuffer(gl) {
    let positions = new Float32Array([
      -1, -1, 0, 1,
      1, 1, 1, 0,
      -1, 1, 0, 0,
      -1, -1, 0, 1,
      1, -1, 1, 1,
      1, 1, 1, 0,
    ]);
    this.buffer = new pCore.GLBuffer(gl, gl.ARRAY_BUFFER, positions.buffer, gl.STATIC_DRAW);

    let ps = new Float32Array([
      -1, -1,
      1, 1,
      -1, 1,
      -1, -1,
      1, -1,
      1, 1,
    ]);
    this.puffer = new pCore.GLBuffer(gl, gl.ARRAY_BUFFER, ps.buffer, gl.STATIC_DRAW);

    let ts = new Float32Array([
      0, 1,
      1, 0,
      0, 0,
      0, 1,
      1, 1,
      1, 0,
    ]);
    this.tuffer = new pCore.GLBuffer(gl, gl.ARRAY_BUFFER, ts.buffer, gl.STATIC_DRAW);
  }

  createVAO(gl) {
    this.vao = new pCore.VertexArrayObject(gl);
    const attributes = this.program.attributes;

    this.vao.addAttribute(
      this.puffer,
      attributes['a_position'],
      gl.FLOAT,
      false,
      0,
      0
    )

    this.vao.addAttribute(
      this.tuffer,
      attributes['a_texcoord'],
      gl.FLOAT,
      false,
      0,
      0
    )

    this.vao.bind();
  }

  createTexture(gl, img) {
    this.texture = new pCore.GLTexture(gl);
    this.texture.upload(to512(img));
    this.texture.minFilter(true);
  }

  render(img) {
    const gl = this.gl;
    const uniforms = this.program.uniforms;

    this.program.bind();
    this.createTexture(gl, img);
    gl.uniform1i(uniforms['u_Sampler'].location, 0);
    this.texture.bind();
    this.vao.bind();
    this.vao.draw(gl.TRIANGLES, 6, 0);
  }
}
