
const vt_shader = `#version 300 es

in vec4 a_position;
in vec2 a_textcoord;

uniform mat4 u_matrix;

out vec2 v_textcoord;

void main () {
  gl_Position = u_matrix * a_position;

  v_textcoord = a_textcoord;
}
`

const fm_shader = `#version 300 es
precision mediump float;

in vec2 v_textcoord;
out vec4 outColor;

uniform sampler2D u_texture;

void main () {
  outColor = texture(u_texture, v_textcoord);
}
`