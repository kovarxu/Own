
const vt_shader = `#version 300 es

in vec2 a_position;
in vec2 a_textcoord;

uniform mat3 u_matrix;

out vec2 v_textcoord;

void main () {
  vec3 pos = u_matrix * vec3(a_position, 1);
  gl_Position = vec4(pos, 1);

  v_textcoord = a_textcoord;
}
`

const fm_shader = `#version 300 es
precision mediump float;

in vec2 v_textcoord;
out vec4 outColor;

uniform sampler2D u_texture;

void main () {
  outColor = texture(u_texture, v_textcoord).bgra;
}
`