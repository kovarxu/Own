
const vt_shader = `#version 300 es

in vec4 a_position;
in vec4 a_normal;

uniform mat4 u_matrix;

out vec4 v_normal;

void main () {
  gl_Position = u_matrix * a_position;

  v_normal = a_normal;
}
`

const fm_shader = `#version 300 es
precision mediump float;

in vec4 v_normal;
out vec4 outColor;

uniform vec3 u_reversedLightDirection;
uniform vec3 u_surfaceColor;

void main () {
  float light = dot(normal(v_normal), u_reversedLightDirection)
  outColor = u_surfaceColor;
}
`