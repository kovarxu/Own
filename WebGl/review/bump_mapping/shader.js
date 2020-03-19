class Shader {
  static getCustomVertexShaderSource () {
    // webgl2 需要始终在首行加上版本声明
    return `#version 300 es
    // 外部传入的attibution
    in vec3 a_position;
    in vec2 a_texcoord;
    // 变换矩阵
    uniform mat4 u_world_matrix;
    uniform mat4 u_camera_matrix;
    uniform mat4 u_view_matrix;
    // 纹理变换矩阵
    uniform mat4 u_texture_matrix;
    // 将纹理坐标传给片元着色器
    out vec4 v_texture_coord;
    out vec2 v_texcoord;

    void main () {
      vec4 poz = u_world_matrix * vec4(a_position, 1.0);
      gl_Position = u_view_matrix * u_camera_matrix * poz;
      v_texture_coord = u_texture_matrix * poz;
      v_texcoord = a_texcoord;
    }
    `
  }

  static getCustomFragmentShaderSource () {
    return `#version 300 es
    // 浮点数精度设定，高精度需要消耗更多性能
    precision mediump float;
    in vec4 v_texture_coord;
    in vec2 v_texcoord;

    // 颜色系数
    uniform vec4 u_color_orig;

    // 纹理句柄
    uniform sampler2D u_texture_custom;
    uniform sampler2D u_texture_mapping;

    out vec4 outColor;
    
    void main () {
      // texture在剪贴空间，拍平
      vec3 normalTexCoord = v_texture_coord.xyz / v_texture_coord.w;

      bool inMapping = false;
      if (normalTexCoord.x >= 0.0 &&
          normalTexCoord.x <= 1.0 &&
          normalTexCoord.y >= 0.0 &&
          normalTexCoord.y <= 1.0) {
        
          inMapping = true;    
      }

      outColor = inMapping ? texture(u_texture_mapping, normalTexCoord.xy): texture(u_texture_custom, v_texcoord) * u_color_orig;
    }
    `
  }

  static getViewVertexShaderSource () {
    // webgl2 需要始终在首行加上版本声明
    return `#version 300 es
    // 外部传入的attibution
    in vec3 a_position;
    // 变换矩阵
    uniform mat4 u_world_matrix;
    uniform mat4 u_camera_matrix;
    uniform mat4 u_view_matrix;

    void main () {
      vec4 poz = u_world_matrix * vec4(a_position, 1.0);
      gl_Position = u_view_matrix * u_camera_matrix * poz;
    }
    `
  }

  static getViewFragmentShaderSource () {
    return `#version 300 es
    // 浮点数精度设定，高精度需要消耗更多性能
    precision mediump float;
    out vec4 outColor;
    void main () {
      outColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
    `
  }
}

