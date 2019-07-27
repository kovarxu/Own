const vt_shader_p = `#version 300 es

in vec4 a_position;

uniform mat4 u_world;

void main () {
  gl_Position = u_world * a_position;
}

`

const fm_shader_p = `#version 300 es
precision mediump float;

out vec4 outColor;

void main () {
  outColor = vec4(0.9, 0.9, 0, 1);
}
`