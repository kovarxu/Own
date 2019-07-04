
const vt_shader = `#version 300 es

in vec2 a_position;
out vec4 v_color;

uniform vec2 u_resolution;
uniform vec2 u_translation;

void main () {
  vec2 relpos = a_position + u_translation;
  vec2 ratio = relpos / u_resolution;
  vec2 clipSpace = ratio * 2.0 - 1.0;

  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1.0);

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