
const vt_shader = `#version 300 es

in vec4 a_position;
in vec4 a_color;

uniform mat4 u_matrix;

out vec4 v_color;

void main () {
  gl_Position = u_matrix * a_position;

  v_color = a_color;
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