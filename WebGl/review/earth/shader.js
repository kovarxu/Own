class Shader {
  static getViewVertexShaderSource () {
    // webgl2 需要始终在首行加上版本声明
    return `#version 300 es
    // 外部传入的attibution
    in vec3 a_position;
    in vec2 a_texcoord;
    // 变换矩阵
    uniform mat4 u_world_matrix;
    uniform mat4 u_camera_matrix;
    uniform mat4 u_view_matrix;
    // 传顶点纹理信息到片元着色器
    out vec2 v_texcoord;

    void main () {
      vec4 poz = u_world_matrix * vec4(a_position, 1.0);
      gl_Position = u_view_matrix * u_camera_matrix * poz;
      v_texcoord = a_texcoord;
    }
    `
  }

  static getViewFragmentShaderSource () {
    return `#version 300 es
    // 浮点数精度设定，高精度需要消耗更多性能
    precision mediump float;
    uniform sampler2D u_texture;
    in vec2 v_texcoord;
    out vec4 outColor;

    void main () {
      outColor = texture(u_texture, v_texcoord);
    }
    `
  }
}

