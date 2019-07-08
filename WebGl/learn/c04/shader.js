
const vt_shader = `#version 300 es

in vec2 a_position;
out vec4 v_color;

uniform mat3 u_matrix;

void main () {
  gl_Position = vec4((u_matrix * vec3(a_position, 1.0)).xy, 0, 1);

  v_color = gl_Position * 0.9 + 0.5;
}
`

const fm_shader = `#version 300 es
precision mediump float;

in vec4 v_color;
out vec4 outColor;

void main () {
  outColor = v_color;
}
`