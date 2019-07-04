
const vt_shader = `#version 300 es

in vec4 a_position;
out vec4 v_color;

void main () {
  gl_Position = a_position;
  v_color = gl_Position * 0.5 + 0.5;
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