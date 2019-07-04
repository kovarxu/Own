
const vt_shader = `#version 300 es

in vec4 a_position;

void main () {
  gl_Position = a_position;
}
`

// use pixel as unit
const vt_shader1 = `#version 300 es

in vec2 a_position;
uniform vec2 u_resolution;

void main() {
  vec2 normalizedCord = a_position / u_resolution;
  vec2 clipSpace = normalizedCord * 2.0 - 1.0;
  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
}

`

const fm_shader = `#version 300 es
precision mediump float;

out vec4 outColor;

void main () {
  outColor = vec4(1.0, 0, 0.5, 1.0);
}
`

// use specified color as filled color

const fm_shader1 = `#version 300 es
precision mediump float;

uniform vec4 u_color;
out vec4 outColor;

void main () {
  outColor = u_color;
}`
