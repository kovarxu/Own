class Shader {
  static getCubeVertexShaderSource () {
    // webgl2 需要始终在首行加上版本声明
    return `#version 300 es
    // 外部传入的attibution
    in vec3 a_position;
    in vec4 a_color;
    // 外部的变换矩阵
    uniform mat4 u_matrix;
    // 将颜色数据传给片元着色器
    out vec4 v_color;

    void main () {
      gl_Position = u_matrix * vec4(a_position, 1.0);
      v_color = a_color;
    }
    `
  }

  static getCubeFragmentShaderSource () {
    return `#version 300 es
    // 浮点数精度设定，高精度需要消耗更多性能
    precision mediump float;
    in vec4 v_color;
    out vec4 outColor;
    void main () {
      outColor = v_color;
    }
    `
  }

  static getCameraVertexShaderSource () {
    // webgl2 需要始终在首行加上版本声明
    return `#version 300 es
    // 外部传入的attibution
    in vec3 a_position;
    // 外部的变换矩阵
    uniform mat4 u_matrix_camera;

    void main () {
      gl_Position = u_matrix_camera * vec4(a_position, 1.0);
    }
    `
  }

  static getCameraFragmentShaderSource () {
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

