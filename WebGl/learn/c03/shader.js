
const vt_shader = `#version 300 es

in vec2 a_position;
out vec4 v_color;

uniform vec2 u_resolution;
uniform mat3 u_matcontrol;

void main () {
  vec2 relpos = (u_matcontrol * vec3(a_position, 1.0)).xy;
  vec2 ratio = relpos / u_resolution;
  vec2 clipSpace = ratio * 2.0 - 1.0;

  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);

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