
function createShader(gl, type, source) {
  let shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if (success) {
      return shader
  }

  console.warn(gl.getShaderInfoLog(shader))
  gl.deleteShader(shader)
}

function createProgram(gl, vertexShader, fragmentShader) {
  let program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)

  let success = gl.getProgramParameter(program, gl.LINK_STATUS)
  if (success) {
      return program
  }

  console.warn(gl.getProgramInfoLog(program))
  gl.deleteProgram(program)
}

const vertexShaderSource = `#version 300 es
precision highp float;
in vec4 a_position;
in vec2 a_texcoord;
out vec2 TexCoord;

void main() {
  gl_Position = vec4(a_position.xy, 0.0, 1.0);
  TexCoord = a_texcoord;
}
`

const fragmentShaderSource = `#version 300 es
precision highp float;
in vec2 TexCoord;

uniform sampler2D u_texture;
out vec4 outColor;
void main() {
  outColor = texture(u_texture, TexCoord);
}
`

const vert = vertexShaderSource;

const frag = `#version 300 es
precision highp float;
in vec2 TexCoord; // Texture coordinates
uniform sampler2D Tex1; // FBO texture
uniform float ScreenCoordX; // X Screen Coordinate
// uniform vec2 FBS; // Frame Buffer Size
layout(location = 0) out vec4 outColor;

// Calculates the luminosity of a sample.
float FxaaLuma(vec3 rgb) {
    const vec3 lumafactor = vec3(0.299, 0.587, 0.114);
    return dot(rgb, lumafactor);
}
void main() {
    // outColor = texture(Tex1, TexCoord);
    // return;
    float FXAA_SPAN_MAX = 8.0;
    float FXAA_REDUCE_MUL = 1.0/8.0;
    float FXAA_REDUCE_MIN = 1.0/128.0;
    vec2 FBS = vec2(500.0, 400.0);

    // Sample 4 texels including the middle one.
    // Since the texture is in UV coordinate system, the Y is
    // therefore, North direction is –ve and south is +ve.
    vec3 rgbNW = texture(Tex1,TexCoord+(vec2(-1.,-1.)/FBS)).xyz;
    vec3 rgbNE = texture(Tex1,TexCoord+(vec2(1.,-1.)/FBS)).xyz;
    vec3 rgbSW = texture(Tex1,TexCoord+(vec2(-1.,1.)/FBS)).xyz;
    vec3 rgbSE = texture(Tex1,TexCoord+(vec2(1.,1.)/FBS)).xyz;
    vec3 rgbM = texture(Tex1,TexCoord).xyz;

    float lumaNW = FxaaLuma(rgbNW); // Top-Left
    float lumaNE = FxaaLuma(rgbNE); // Top-Right
    float lumaSW = FxaaLuma(rgbSW); // Bottom-Left
    float lumaSE = FxaaLuma(rgbSE); // Bottom-Right
    float lumaM = FxaaLuma(rgbM); // Middle

    // Get the edge direction, since the y components are inverted
    // be careful to invert the resultant x
    vec2 dir;
    dir.x = -((lumaNW + lumaNE) - (lumaSW + lumaSE));
    dir.y = ((lumaNW + lumaSW) - (lumaNE + lumaSE));

    // Now, we know which direction to blur,
    // But far we need to blur in the direction?
    float dirReduce = max((lumaNW + lumaNE + lumaSW + lumaSE) *
        (0.25 * FXAA_REDUCE_MUL),FXAA_REDUCE_MIN);
    float rcpDirMin = 1.0/(min(abs(dir.x),abs(dir.y))+dirReduce);

    dir = min(vec2( FXAA_SPAN_MAX, FXAA_SPAN_MAX), max(vec2(-
        FXAA_SPAN_MAX,-FXAA_SPAN_MAX), dir*rcpDirMin))/FBS;

    vec3 rgbA = (1.0/2.0)*(texture(Tex1, TexCoord.xy + dir *
        (1.0/3.0 - 0.5)).xyz + texture(Tex1, TexCoord.xy
        + dir * (2.0/3.0 - 0.5)).xyz);
    vec3 rgbB = rgbA * (1.0/2.0) + (1.0/4.0) * (texture(Tex1,
        TexCoord.xy + dir * (0.0/3.0 - 0.5)).xyz + texture
        (Tex1, TexCoord.xy + dir * (3.0/3.0 - 0.5)).xyz);

    float lumaB = FxaaLuma(rgbB);
    float lumaMin = min(lumaM, min(min(lumaNW, lumaNE),
        min(lumaSW, lumaSE)));
    float lumaMax = max(lumaM, max(max(lumaNW, lumaNE),
        max(lumaSW, lumaSE)));
    if((lumaB < lumaMin) || (lumaB > lumaMax)){
        outColor = vec4(rgbA, 1.0);
    }else{
        outColor = vec4(rgbB, 1.0);
    }
}`

export default class WebGl2Renderer {
  constructor(canvasElement) {
      this.canvas = canvasElement;
      this.ctx = canvasElement.getContext('webgl2');
      // [img -- texture] mapping
      this.textureMap = (window.WeakMap && /native code/.test(String(WeakMap))) ? new WeakMap() : new Map();
      this.initRenderer();
  }

  initRenderer() {
      const gl = this.ctx;
      gl.getExtension('OES_texture_float_linear');

      const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
      const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

      const program = createProgram(gl, vertexShader, fragmentShader);
      this.program = program;

      const vs = createShader(gl, gl.VERTEX_SHADER, vert);
      const fs = createShader(gl, gl.FRAGMENT_SHADER, frag);
      const p2 = createProgram(gl, vs, fs);
      this.p2 = p2;

      let p2AttrLoc = gl.getAttribLocation(p2, 'a_position');
      let p2AttrTex = gl.getAttribLocation(p2, 'a_texcoord');
      let p2TexPoz = gl.getUniformLocation(program, 'Tex1');

      let positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
      let texcoordAttributeLocation = gl.getAttribLocation(program, 'a_texcoord');
      // here we only have one texture as not necessary to bind texture
      let textureUniformLocation = gl.getUniformLocation(program, 'u_texture');

      // frameBuffer 
      {
          this.framebuffer = gl.createFramebuffer();
      }

      // Position Buffer
      {
          let positionBuffer = gl.createBuffer()
          gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
          let positions = [
              -1, -1,
              1, 1,
              -1, 1,
              -1, -1,
              1, -1,
              1, 1,
          ];
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
          // create and bind vao
          let vao = gl.createVertexArray();
          gl.bindVertexArray(vao);
          this.vao = vao;
          // activate point attribute
          gl.enableVertexAttribArray(positionAttributeLocation)
          // bind the current ARRAY_BUFFER to attribute
          let size = 2, type = gl.FLOAT, normalize = false, stride = 0, offset = 0
          gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset)
      }

      // Texture Buffer
      {
          let textureBuffer = gl.createBuffer()
          gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer)

          // we should calculate the texture size
          // const hp = width / this._texcanvas.width;
          // const vp = height / this._texcanvas.height;
          const hp = 1;
          const vp = 1;
          let textureCoords = [
              0, vp,
              hp, 0,
              0, 0,
              0, vp,
              hp, vp,
              hp, 0
          ];
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
          // activate point attribute
          gl.enableVertexAttribArray(texcoordAttributeLocation)
          // bind the current ARRAY_BUFFER to attribute
          let size = 2, type = gl.FLOAT, normalize = false, stride = 0, offset = 0
          gl.vertexAttribPointer(texcoordAttributeLocation, size, type, normalize, stride, offset)
      }

      {
        gl.useProgram(gl.p2);
        let positionBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
        let positions = [
            -1, -1,
            1, 1,
            -1, 1,
            -1, -1,
            1, -1,
            1, 1,
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
        // create and bind vao
        let vao = gl.createVertexArray();
        gl.bindVertexArray(vao);
        this.vao2 = vao;
        // activate point attribute
        gl.enableVertexAttribArray(p2AttrLoc)
        // bind the current ARRAY_BUFFER to attribute
        let size = 2, type = gl.FLOAT, normalize = false, stride = 0, offset = 0
        gl.vertexAttribPointer(p2AttrLoc, size, type, normalize, stride, offset)
    }
    {
        let textureBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer)

        // we should calculate the texture size
        // const hp = width / this._texcanvas.width;
        // const vp = height / this._texcanvas.height;
        const hp = 1;
        const vp = 1;
        let textureCoords = [
            0, vp,
            hp, 0,
            0, 0,
            0, vp,
            hp, vp,
            hp, 0
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.DYNAMIC_DRAW);
        // activate point attribute
        gl.enableVertexAttribArray(p2AttrTex)
        // bind the current ARRAY_BUFFER to attribute
        let size = 2, type = gl.FLOAT, normalize = false, stride = 0, offset = 0
        gl.vertexAttribPointer(p2AttrTex, size, type, normalize, stride, offset)
    }
  }

  initTexture(image) {
      const gl = this.ctx;
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      // gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      return texture;
  }

  activeTexture(image) {
      const gl = this.ctx;
      const texture = this.textureMap.get(image);
      if (texture) {
          gl.bindTexture(gl.TEXTURE_2D, texture);
      } else {
          const texture = this.initTexture(image);
          this.textureMap.set(image, texture);
      }
  }

  // we create texture and mipmap as soon as the atlas are downloaded
  // keep these in memory and reuse
  notify(atlas) {
      for (let i = 0; i < atlas.length; i++) {
          const image = atlas[i];
          if (image && !this.textureMap.get(image)) {
              const texture = this.initTexture(image);
              this.textureMap.set(image, texture);
          }
      }
  }

  clear () {
      const gl = this.ctx;
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }

  createTargetTexture() {
        const gl = this.ctx;
        const targetTextureWidth = 500;
        const targetTextureHeight = 400;
        const targetTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, targetTexture);

        // define size and format of level 0
        const level = 0;
        const internalFormat = gl.RGBA;
        const border = 0;
        const format = gl.RGBA;
        const type = gl.UNSIGNED_BYTE;
        const data = null;
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                        targetTextureWidth, targetTextureHeight, border,
                        format, type, data);

        // set the filtering so we don't need mips
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        this.targetTexture = targetTexture;
  }

  render(img) {
      // must implement this
      const { width, height } = this.canvas;
      // necessary
      const gl = this.ctx;
      gl.useProgram(this.p2);

    //   gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);

      // we should create a new targetTexture
    //   this.createTargetTexture();
    //   gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.targetTexture, 0);

      // active the img texture
      this.activeTexture(img);

      gl.viewport(0, 0, width, height);
      this.clear();

      // gl.enable(gl.CULL_FACE);
      
      gl.bindVertexArray(this.vao2);

      let primitiveType = gl.TRIANGLES;
      let offset = 0, count = 6;
      gl.drawArrays(primitiveType, offset, count);

      // draw on screen
    //   gl.useProgram(this.program);
    //   gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    //   gl.bindTexture(gl.TEXTURE_2D, this.targetTexture);
    //   gl.bindVertexArray(this.vao2);

    //   gl.clearColor(0, 0, 0, 1);   // clear to black
    //   gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //   gl.drawArrays(primitiveType, offset, count);
  }
}
